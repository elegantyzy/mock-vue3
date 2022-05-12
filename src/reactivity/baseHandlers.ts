import { isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readOnly } from "./reactive";

const get = creatGetter();
const set = creatSetter();
export const readOnlyHandlers = {
    get: creatGetter(true),
    set(target, key, value, receiver){
        console.warn(`${target}的属性${key}修改失败,${receiver}是只读的`)
        return true;
    }
}

export const mutableHandlers = {
    get,
    set,
}

export const shallowReadOnlyHandlers = {
    get: creatGetter(true, true),
    set: readOnlyHandlers.set
}

function creatGetter(isReadOnly = false, shallow = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key);
        switch (key) {
            case ReactiveFlags.IS_REACTIVE:
                return !isReadOnly;
            case ReactiveFlags.IS_READONLY:
                return isReadOnly;
        }
        if (shallow) {
            return res
        }
        if (!isReadOnly) {
            track(target, key);
        }
        if (isObject(res)) {
            return isReadOnly ? readOnly(res) : reactive(res)
        }
        return res
    }
}

function creatSetter() {
    return function set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver);
        trigger(target, key);
        return res
    }
}