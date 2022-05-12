import { readOnlyHandlers, mutableHandlers, shallowReadOnlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

export function reactive(raw){
    return createReactiveObject(raw, mutableHandlers)
}

export function readOnly(raw) {
    return createReactiveObject(raw, readOnlyHandlers)
}

export function shallowReadOnly(raw){
    return createReactiveObject(raw, shallowReadOnlyHandlers)
}

export function isProxy(value){
    return isReactive(value) || isReadOnly(value);
}

export function isReactive(target){
    return !!target[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(target){
    return !!target[ReactiveFlags.IS_READONLY]
}

function createReactiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}
