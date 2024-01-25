import { describe, expect, test } from "bun:test";

import { midString } from "@/utils/sorting";

describe("sorting", () => {
  describe("midString", () => {
    test("should handle cases where both strings are empty", () => {
      expect(midString("", "")).toBe("n");
    });

    test("should return a previous middle character when 'prev' string is empty (inserting before next)", () => {
      expect(midString("", "n")).toBe("g");
      expect(midString("", "z")).toBe("m");
      expect(midString("", "b")).toBe("an");
      expect(midString("", "fp")).toBe("c");
      expect(midString("", "aaaan")).toBe("aaaag");
    });

    test("should return a next middle character when 'next' string is empty (inserting after prev)", () => {
      expect(midString("a", "")).toBe("n");
      expect(midString("n", "")).toBe("u");
      expect(midString("z", "")).toBe("zn");
      expect(midString("fw", "")).toBe("q");
      expect(midString("zzzz", "")).toBe("zzzzn");
    });

    test("should return the middle character when given two consecutive characters", () => {
      expect(midString("a", "b")).toBe("an");
      expect(midString("c", "d")).toBe("cn");
      expect(midString("x", "y")).toBe("xn");
    });

    test("should return the middle character when given two NON consecutive characters", () => {
      expect(midString("a", "c")).toBe("b");
      expect(midString("x", "z")).toBe("y");
      expect(midString("a", "z")).toBe("n");
      expect(midString("m", "s")).toBe("p");
    });

    test("should return the middle character when the prefix is equal to the beginning of the next string", () => {
      expect(midString("nn", "nz")).toBe("nt");
      expect(midString("dab", "dan")).toBe("dah");
      expect(midString("abcb", "abcd")).toBe("abcc");
      expect(midString("hello", "helloworld")).toBe("hellol");
    });

    test("should return the middle character when given two strings with different prefixes", () => {
      expect(midString("xabc", "yabc")).toBe("xn");
      expect(midString("xxxabc", "yabc")).toBe("xz");
      expect(midString("dogabc", "qwertyabc")).toBe("k");
      expect(midString("prefix", "preffix")).toBe("prefh");
    });
  });
});
