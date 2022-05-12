import { isProxy, isReadOnly, readOnly } from "../reactive";

describe("readOnly", () => {
    it("readOnly happt path", () => {
        const original = {
            foo: 1,
            bar: 'bar',
            user: {
                name: "test",
                age: 18
            }
        };
        const wapper = readOnly(original);
        expect(wapper).not.toBe(original);
        wapper.foo = 2;
        expect(wapper.foo).toBe(1);
        expect(isReadOnly(wapper)).toBe(true);
        expect(isReadOnly(original)).toBe(false);
        expect(isReadOnly(wapper.user)).toBe(true);
        expect(isProxy(wapper)).toBe(true);
        expect(isProxy(original)).toBe(false)
    })
})