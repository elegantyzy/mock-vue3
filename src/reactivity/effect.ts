export class ReactiveEffect{
    active = true;
    onStop?: () => void;
    private _fn: any;
    deps = [];
    public scheduler: Function | undefined;
    constructor(fn, scheduler?: Function){
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run(){
        if (!this.active) {      
            return this._fn();      
        }
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false;
        return result;        
    }

    stop(){
        if (this.active) {
            cleanUpEffect(this);
            this.onStop && this.onStop();
            this.active = false;   
        }
    }
}
let activeEffect;
let shouldTrack;

const targetMap = new Map();

function cleanUpEffect(effect){
    effect.deps.forEach(dep => dep.delete(effect));
    effect.deps.length = 0;
}

export function track(target, key){
    if (!isTracking()) return

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap)
    }

    let dep = targetMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep)
    }
    trackEffects(dep);    
}

export function trackEffects(dep){
    if (dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep);
}

export function trigger(target, key){
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}

export function triggerEffects(dep){
    for (const effect of dep) {
        effect.scheduler ? effect.scheduler() : effect.run(); 
    }
}

export function isTracking(){
    return shouldTrack && activeEffect;
}

export function effect(fn, options:any = {}){
    const _effect = new ReactiveEffect(fn, options.scheduler);
    Object.assign(_effect, options);
    _effect.run();
    
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop(runner) {
    runner.effect.stop();
}