import { describe, it, expect } from "vitest";
import { originOf, hostnameOf, registrableDomain, siblingOrigins } from "../lib/origin.js";

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

describe("registrableDomain", () => {
  describe("common web hostnames", () => {
    it.each([
      ["example.com",             "example.com"],
      ["www.example.com",         "example.com"],
      ["api.example.com",         "example.com"],
      ["api.sub.example.com",     "example.com"],
      ["EXAMPLE.COM",             "EXAMPLE.COM"]
    ])("registrableDomain(%s) === %s", (input, expected) => {
      expect(registrableDomain(input)).toBe(expected);
    });
  });

  describe("multi-label public suffixes", () => {
    it.each([
      ["example.co.uk",           "example.co.uk"],
      ["api.example.co.uk",       "example.co.uk"],
      ["www.example.com.au",      "example.com.au"],
      ["user.github.io",          "user.github.io"],
      ["app.user.github.io",      "user.github.io"],
      ["proj.vercel.app",         "proj.vercel.app"],
      ["deploy.proj.vercel.app",  "proj.vercel.app"]
    ])("registrableDomain(%s) === %s", (input, expected) => {
      expect(registrableDomain(input)).toBe(expected);
    });
  });

  describe("special hostnames (kept as-is)", () => {
    it.each([
      ["localhost",               "localhost"],
      ["127.0.0.1",               "127.0.0.1"],
      ["192.168.1.10",            "192.168.1.10"],
      ["::1",                     "::1"]
    ])("registrableDomain(%s) === %s", (input, expected) => {
      expect(registrableDomain(input)).toBe(expected);
    });
  });

  describe("invalid input", () => {
    it.each([
      [null],
      [undefined],
      [""],
      [123],
      [{}]
    ])("registrableDomain(%j) === null", (input) => {
      expect(registrableDomain(input)).toBeNull();
    });
  });
});

describe("siblingOrigins", () => {
  const tabs = [
    { url: "https://www.example.com/home" },
    { url: "https://api.example.com/v1" },
    { url: "https://docs.example.com/" },
    { url: "https://unrelated.com/foo" },
    { url: "chrome://settings" },
    { url: "about:blank" },
    { url: undefined }
  ];

  it("returns all open origins sharing the current tab's registrable domain", () => {
    const result = siblingOrigins("https://www.example.com/home", tabs);
    expect(result).toEqual(new Set([
      "https://www.example.com",
      "https://api.example.com",
      "https://docs.example.com"
    ]));
  });

  it("works when invoked from a non-www subdomain", () => {
    const result = siblingOrigins("https://api.example.com/v1", tabs);
    expect(result).toEqual(new Set([
      "https://www.example.com",
      "https://api.example.com",
      "https://docs.example.com"
    ]));
  });

  it("excludes unrelated domains", () => {
    const result = siblingOrigins("https://www.example.com/", tabs);
    expect(result.has("https://unrelated.com")).toBe(false);
  });

  it("excludes non-web tabs", () => {
    const result = siblingOrigins("https://www.example.com/", tabs);
    for (const o of result) {
      expect(o.startsWith("http")).toBe(true);
    }
  });

  it("returns an empty Set when the current URL is non-web", () => {
    expect(siblingOrigins("chrome://settings", tabs)).toEqual(new Set());
    expect(siblingOrigins("about:blank", tabs)).toEqual(new Set());
    expect(siblingOrigins(null, tabs)).toEqual(new Set());
  });

  it("handles an empty tab list gracefully", () => {
    expect(siblingOrigins("https://www.example.com/", [])).toEqual(new Set());
    expect(siblingOrigins("https://www.example.com/", undefined)).toEqual(new Set());
  });

  it("handles multi-label public suffixes (co.uk)", () => {
    const ukTabs = [
      { url: "https://www.bbc.co.uk/" },
      { url: "https://news.bbc.co.uk/" },
      { url: "https://other.co.uk/" }
    ];
    const result = siblingOrigins("https://www.bbc.co.uk/", ukTabs);
    expect(result).toEqual(new Set([
      "https://www.bbc.co.uk",
      "https://news.bbc.co.uk"
    ]));
  });
});
