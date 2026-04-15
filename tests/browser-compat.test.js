import { describe, it, expect } from "vitest";
import { dataTypesFor } from "../lib/browser-compat.js";

describe("dataTypesFor", () => {
  describe("Chrome path (isFirefox=false)", () => {
    it("returns the input object unchanged", () => {
      const input = { cache: true, cacheStorage: true, serviceWorkers: true };
      expect(dataTypesFor(false, input)).toBe(input);
    });

    it("preserves cacheStorage and serviceWorkers", () => {
      const input = { cache: true, cacheStorage: true, serviceWorkers: true };
      expect(dataTypesFor(false, input)).toEqual({
        cache: true,
        cacheStorage: true,
        serviceWorkers: true
      });
    });
  });

  describe("Firefox path (isFirefox=true)", () => {
    it("strips cacheStorage", () => {
      const input = { cache: true, cacheStorage: true };
      expect(dataTypesFor(true, input)).toEqual({ cache: true });
    });

    it("strips serviceWorkers", () => {
      const input = { cache: true, serviceWorkers: true };
      expect(dataTypesFor(true, input)).toEqual({ cache: true });
    });

    it("strips both cacheStorage and serviceWorkers at once", () => {
      const input = { cache: true, cacheStorage: true, serviceWorkers: true };
      expect(dataTypesFor(true, input)).toEqual({ cache: true });
    });

    it("preserves Firefox-supported keys", () => {
      const input = {
        cache: true,
        cacheStorage: true,
        serviceWorkers: true,
        cookies: true,
        localStorage: true,
        indexedDB: true
      };
      expect(dataTypesFor(true, input)).toEqual({
        cache: true,
        cookies: true,
        localStorage: true,
        indexedDB: true
      });
    });

    it("returns empty object for empty input", () => {
      expect(dataTypesFor(true, {})).toEqual({});
    });

    it("does not mutate the input object", () => {
      const input = { cache: true, cacheStorage: true };
      dataTypesFor(true, input);
      expect(input).toEqual({ cache: true, cacheStorage: true });
    });

    it("returns a new object, not a reference to the input", () => {
      const input = { cache: true };
      expect(dataTypesFor(true, input)).not.toBe(input);
    });
  });
});
