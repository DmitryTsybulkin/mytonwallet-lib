export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function sample<T extends any>(arr: T[]) {
  return arr[random(0, arr.length - 1)];
}

export function randomBytes(size: number) {
  // eslint-disable-next-line no-restricted-globals
  return self.crypto.getRandomValues(new Uint8Array(size));
}
