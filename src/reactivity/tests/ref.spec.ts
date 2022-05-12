import { effect } from "../effect";
import { isRef, proxyRefs, ref, unRef } from "../ref"

describe("ref", () => {
    it("ref get", () => {
        const value = ref(10);
        expect(value.value).toBe(10);
    })

    it("should be reactive", () => {
        const a = ref(1);
        let dummy;
        let calls = 0;
        effect(() => {
          calls++;
          dummy = a.value;
        });
        expect(calls).toBe(1);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
        // same value should not trigger
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
      });

      it("should make nested properties reactive", () => {
        const a = ref({
          count: 1,
        });
        let dummy;
        effect(() => {
          dummy = a.value.count;
        });
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
      });

      it("isRef test", () => {
        const a = ref(1);
        expect(isRef(a)).toBe(true);
        expect(isRef(25)).toBe(false);
      })

      it("unRef test", () => {
        const a = ref(1);
        expect(unRef(a)).toBe(1);
        expect(unRef(25)).toBe(25);
      })

      it("proxyRefs", () => {
        const user = {
          name: 'yzy',
          age: ref(18)
        };
        const proxyRefsUser = proxyRefs(user);
        expect(proxyRefsUser.age).toBe(18);
        expect(user.age.value).toBe(18);

        proxyRefsUser.age = 20;
        expect(proxyRefsUser.age).toBe(20);
        expect(user.age.value).toBe(20);

        proxyRefsUser.age = ref(24);
        expect(proxyRefsUser.age).toBe(24);
        expect(user.age.value).toBe(24);
      })
})