export let activeEffect: ReactiveEffect | null = null;

export let targetMaps = new WeakMap<object, Map<string, Set<ReactiveEffect>>>();

export interface ReactiveEffectOptions {
  scheduler?: () => any;
}

export class ReactiveEffect {
  public dependencies: any[] = [];

  scheduler: (() => any) | null = null;

  constructor(private readonly fn) {
    this.fn = fn;
  }

  run() {
    /**
     * 用于后续的依赖收集
     */
    activeEffect = this;

    return this.fn();
  }
}

export function effect(
  fn,
  options: ReactiveEffectOptions = {}
): ReactiveEffect["run"] {
  const _effect = new ReactiveEffect(fn);
  _effect.run();

  // 自定义 scheduler
  if (options.scheduler) {
    _effect.scheduler = options.scheduler;
  }

  const _runner = _effect.run.bind(_effect);
  return _runner;
}

export function track(target, key: string) {
  let targetDependencies = targetMaps.get(target);

  if (!targetDependencies) {
    targetDependencies = new Map();
    targetMaps.set(target, targetDependencies);
  }

  // 找到key对应的依赖
  let propertyDependencies = targetDependencies?.get(key);
  if (!propertyDependencies) {
    propertyDependencies = createDependencySet();
    targetDependencies?.set(key, propertyDependencies);
  }

  trackEffects(propertyDependencies);
}

function createDependencySet() {
  return new Set<ReactiveEffect>();
}

function trackEffects(dep) {
  if (dep.has(activeEffect)) {
    return;
  }

  if (activeEffect) {
    dep.add(activeEffect);
  }

  activeEffect?.dependencies.push(dep);
}

export function trigger(target: object, key: string) {
  const targetDependencies = targetMaps.get(target);
  const propertyDependencies = targetDependencies?.get(key);
  triggerEffect(propertyDependencies);
}

export function triggerEffect(dep) {
  if (dep) {
    dep.forEach((effect) => {
      if (effect.scheduler) {
        return effect.scheduler();
      }
      return effect.run();
    });
  }
}
