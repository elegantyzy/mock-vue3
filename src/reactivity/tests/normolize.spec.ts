import { normolizeClass } from "../normolize";
describe("normolize", () => {
    it("happy path", () => {
        let arr = ["ra", { orr: "nan" }, "foo bar", { baz: true }]
        let value = normolizeClass(arr);
        expect(value).toBe("ra orr foo bar baz");
    })
})
