import { track, trigger } from "./effect";

export function createReactive<T extends object>(target: T, handlers = {}): T {
  const proxyObject = new Proxy(target, handlers);
  return proxyObject;
}

function createGetter() {
  return function (target, key) {
    track(target, key);
    return Reflect.get(target, key);
  };
}

function createSetter() {
  return function (target, key, value) {
    const result = Reflect.set(target, key, value);
    trigger(target, key);
    return result;
  };
}

export function reactive<T extends object>(target: T): T {
  return createReactive(target, {
    get: createGetter(),
    set: createSetter(),
  });
}
