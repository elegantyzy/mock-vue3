import { isReadOnly, shallowReadOnly } from "../reactive";

describe("shallowReadOnly", () => {
    it("shallowReadOnly happy path", () => {
        const original = {
            foo: {
                bar: 'bar'
            }
        };
        const wapper = shallowReadOnly(original);
        expect(isReadOnly(wapper)).toBe(true);
        expect(isReadOnly(wapper.foo)).toBe(false);
        expect(isReadOnly(wapper.foo.bar)).toBe(false)
    })
    it("should call console.log warn when set", () => {
        console.warn = jest.fn();
        const user = shallowReadOnly({
            age: 18
        });
        user.age = 20;
        expect(console.warn).toHaveBeenCalled();
    })
})