import { DEFAULT_ERROR_PAUSE, DEFAULT_RETRIES, DEFAULT_TIMEOUT } from '../config';
import { ApiServerError } from '../api/errors';
import { logDebug } from './logs';
import { pause } from './schedulers';

type QueryParams = Record<string, string | number | boolean | string[]>;

const DEFAULT_TIMEOUTS = [5000, 10000, 30000]; // 5, 10, 30 sec

export async function fetchJson(url: string | URL, data?: QueryParams, init?: RequestInit) {
  const urlObject = new URL(url);
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          urlObject.searchParams.append(key, item.toString());
        });
      } else {
        urlObject.searchParams.set(key, value.toString());
      }
    });
  }
  const response = await fetchWithRetry(urlObject, init);

  return response.json();
}

export async function fetchWithRetry(url: string | URL, init?: RequestInit, options?: {
  retries?: number;
  timeouts?: number | number[];
  conditionFn?: (message?: string, statusCode?: number) => boolean;
}) {
  const {
    retries = DEFAULT_RETRIES,
    timeouts = DEFAULT_TIMEOUTS,
    conditionFn,
  } = options ?? {};

  let message = 'Unknown error.';
  let statusCode: number | undefined;

  for (let i = 1; i <= retries; i++) {
    try {
      if (i > 1) {
        logDebug(`Retry request #${i}:`, url.toString());
      }

      const timeout = Array.isArray(timeouts)
        ? timeouts[i - 1] ?? timeouts[timeouts.length - 1]
        : timeouts;
      const response = await fetchWithTimeout(url, init, timeout);
      statusCode = response.status;

      if (statusCode >= 400) {
        if (response.headers.get('content-type') !== 'application/json') {
          throw new Error(`HTTP Error ${statusCode}`);
        }
        const { error } = await response.json();
        throw new Error(error ?? `HTTP Error ${statusCode}`);
      }

      return response;
    } catch (err: any) {
      message = typeof err === 'string' ? err : err.message ?? message;

      if (statusCode === 400 || conditionFn?.(message, statusCode)) {
        throw new ApiServerError(message, statusCode);
      }

      if (i < retries) {
        await pause(DEFAULT_ERROR_PAUSE * i);
      }
    }
  }

  throw new ApiServerError(message);
}

export async function fetchWithTimeout(url: string | URL, init?: RequestInit, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(id);
  }
}

export function handleFetchErrors(response: Response, ignoreHttpCodes?: number[]) {
  if (!response.ok && (!ignoreHttpCodes?.includes(response.status))) {
    throw new Error(response.statusText);
  }
  return response;
}
