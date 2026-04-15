import { describe, it, expect } from "vitest";
import { originOf, hostnameOf } from "../lib/origin.js";

describe("originOf", () => {
  describe("returns the origin for valid web URLs", () => {
    it.each([
      ["https://example.com",                 "https://example.com"],
      ["http://example.com",                  "http://example.com"],
      ["https://example.com/",                "https://example.com"],
      ["https://example.com/some/path",       "https://example.com"],
      ["https://example.com/path?q=1#hash",   "https://example.com"],
      ["https://sub.example.com:8080/x",      "https://sub.example.com:8080"],
      ["http://localhost:3000/dashboard",     "http://localhost:3000"],
      ["https://192.168.1.10/admin",          "https://192.168.1.10"],
      ["https://例え.jp/path",                  "https://xn--r8jz45g.jp"]
    ])("originOf(%s) === %s", (input, expected) => {
      expect(originOf(input)).toBe(expected);
    });
  });

  describe("returns null for non-web URLs", () => {
    it.each([
      ["chrome://settings"],
      ["chrome-extension://abcdef/popup.html"],
      ["edge://settings"],
      ["about:blank"],
      ["about:newtab"],
      ["file:///C:/Users/x/file.html"],
      ["data:text/html,<h1>hi</h1>"],
      ["javascript:void(0)"],
      ["view-source:https://example.com"],
      ["blob:https://example.com/abc-def"],
      ["ftp://example.com/file.txt"],
      ["ws://example.com/socket"],
      ["wss://example.com/socket"]
    ])("originOf(%s) === null", (input) => {
      expect(originOf(input)).toBeNull();
    });
  });

  describe("returns null for invalid input", () => {
    it.each([
      [undefined],
      [null],
      [""],
      ["not a url"],
      ["://missing-protocol.com"],
      ["http://"],
      [123]
    ])("originOf(%j) === null", (input) => {
      expect(originOf(input)).toBeNull();
    });
  });
});

describe("hostnameOf", () => {
  describe("returns the bare hostname for valid web URLs", () => {
    it.each([
      ["https://example.com",                 "example.com"],
      ["http://example.com",                  "example.com"],
      ["https://example.com/",                "example.com"],
      ["https://example.com/some/path",       "example.com"],
      ["https://example.com/path?q=1#hash",   "example.com"],
      ["https://sub.example.com:8080/x",      "sub.example.com"],
      ["http://localhost:3000/dashboard",     "localhost"],
      ["https://192.168.1.10/admin",          "192.168.1.10"],
      ["https://例え.jp/path",                  "xn--r8jz45g.jp"]
    ])("hostnameOf(%s) === %s", (input, expected) => {
      expect(hostnameOf(input)).toBe(expected);
    });
  });

  describe("returns null for non-web URLs", () => {
    it.each([
      ["chrome://settings"],
      ["chrome-extension://abcdef/popup.html"],
      ["edge://settings"],
      ["about:blank"],
      ["about:newtab"],
      ["file:///C:/Users/x/file.html"],
      ["data:text/html,<h1>hi</h1>"],
      ["javascript:void(0)"],
      ["view-source:https://example.com"],
      ["blob:https://example.com/abc-def"],
      ["ftp://example.com/file.txt"],
      ["ws://example.com/socket"],
      ["wss://example.com/socket"]
    ])("hostnameOf(%s) === null", (input) => {
      expect(hostnameOf(input)).toBeNull();
    });
  });

  describe("returns null for invalid input", () => {
    it.each([
      [undefined],
      [null],
      [""],
      ["not a url"],
      ["://missing-protocol.com"],
      ["http://"],
      [123]
    ])("hostnameOf(%j) === null", (input) => {
      expect(hostnameOf(input)).toBeNull();
    });
  });
});
