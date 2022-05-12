import { isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value: any
    public dep
    private _rawValue: any;
    private __v_isRef: Boolean = true
    constructor(value){
       this._rawValue = value;        
       this._value = isObject(value) ? reactive(value) : value;
       this.dep = new Set();
    }
    get value () {     
        trackRefValue(this);
        return this._value;
    }
    set value (newValue) {
        if (!Object.is(this._rawValue, newValue)) {
            this._rawValue = newValue;
            this._value = isObject(newValue) ? reactive(newValue) : newValue;
            triggerEffects(this.dep);            
        }
    }
}


export function ref(value){
    return new RefImpl(value)
}

export function isRef(value){
    return !!value.__v_isRef
}

export function unRef(value){
    return isRef(value) ? value.value : value;
}

export function proxyRefs(objectWithProxy){
    return new Proxy(objectWithProxy, {
        get: (target, key) => unRef(Reflect.get(target, key)),
        set: (target, key, value, receiver) => {
            const oldValue = target[key]
            if (isRef(oldValue) && !isRef(value)) {
                return oldValue.value = value;
            } else {
                return Reflect.set(target, key, value, receiver);
            }
        }
    })
}

export function trackRefValue(ref){
    if (!isTracking()) return
    trackEffects(ref.dep);   
}