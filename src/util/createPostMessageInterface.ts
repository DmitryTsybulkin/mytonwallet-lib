import type {
  ApiUpdate,
  CancellableCallback,
  OriginMessageData,
  OriginMessageEvent,
  WorkerMessageData,
} from './PostMessageConnector';
import {logDebugError} from './logs';

declare const self: WorkerGlobalScope;

const callbackState = new Map<string, CancellableCallback>();

type ApiConfig =
  ((name: string, ...args: any[]) => any | [any, ArrayBuffer[]])
  | Record<string, Function>;
type SendToOrigin = (data: WorkerMessageData, transferables?: Transferable[]) => void;

export function createPostMessageInterface(
  api: ApiConfig,
  channel?: string,
  target: DedicatedWorkerGlobalScope | Worker = self as DedicatedWorkerGlobalScope,
  shouldIgnoreErrors?: boolean,
) {
  function sendToOrigin(data: WorkerMessageData, transferables?: Transferable[]) {
    data.channel = channel;

    if (transferables) {
      target.postMessage(data, transferables);
    } else {
      target.postMessage(data);
    }
  }

  if (!shouldIgnoreErrors) {
    handleErrors(sendToOrigin);
  }

  target.onmessage = (message: OriginMessageEvent) => {
    if (message.data?.channel === channel) {
      onMessage(api, message.data, sendToOrigin);
    }
  };
}

async function onMessage(
  api: ApiConfig,
  data: OriginMessageData,
  sendToOrigin: SendToOrigin,
  onUpdate?: (update: ApiUpdate) => void,
  origin?: string,
) {
  if (!onUpdate) {
    onUpdate = (update: ApiUpdate) => {
      sendToOrigin({
        type: 'update',
        update,
      });
    };
  }

  switch (data.type) {
    case 'init': {
      const { args } = data;
      const promise = typeof api === 'function'
        ? api('init', origin, onUpdate, ...args)
        : api.init?.(onUpdate, ...args);
      await promise;

      break;
    }
    case 'callMethod': {
      const {
        messageId, name, args, withCallback,
      } = data;
      try {
        if (messageId && withCallback) {
          const callback = (...callbackArgs: any[]) => {
            const lastArg = callbackArgs[callbackArgs.length - 1];

            sendToOrigin({
              type: 'methodCallback',
              messageId,
              callbackArgs,
            }, isTransferable(lastArg) ? [lastArg] : undefined);
          };

          callbackState.set(messageId, callback);

          args.push(callback as never);
        }

        const response = typeof api === 'function'
          ? await api(name, origin, ...args)
          : await api[name](...args);
        const { arrayBuffer } = (typeof response === 'object' && 'arrayBuffer' in response && response) || {};

        if (messageId) {
          sendToOrigin(
            {
              type: 'methodResponse',
              messageId,
              response,
            },
            arrayBuffer ? [arrayBuffer] : undefined,
          );
        }
      } catch (err: any) {
        logDebugError(name, err);

        if (messageId) {
          sendToOrigin({
            type: 'methodResponse',
            messageId,
            error: { message: err.message },
          });
        }
      }

      if (messageId) {
        callbackState.delete(messageId);
      }

      break;
    }
    case 'cancelProgress': {
      const callback = callbackState.get(data.messageId);
      if (callback) {
        callback.isCanceled = true;
      }

      break;
    }
  }
}

function isTransferable(obj: any) {
  return obj instanceof ArrayBuffer || obj instanceof ImageBitmap;
}

function handleErrors(sendToOrigin: SendToOrigin) {
  self.onerror = (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    sendToOrigin({ type: 'unhandledError', error: { message: e.error?.message || 'Uncaught exception in worker' } });
  };

  self.addEventListener('unhandledrejection', (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    sendToOrigin({ type: 'unhandledError', error: { message: e.reason?.message || 'Uncaught rejection in worker' } });
  });
}
