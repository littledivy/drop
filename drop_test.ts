import { assertEquals } from "https://deno.land/std@0.89.0/testing/asserts.ts";

import { drop } from "./drop.ts";
import { FetchResource, TextDecoderResource } from "./resources.ts";

const assertResources = (expected: Deno.ResourceMap) => {
  const resources = Deno.resources();
  assertEquals(resources, expected);
};

const defaultResources: Deno.ResourceMap = {
  "0": "stdin",
  "1": "stdout",
  "2": "stderr",
};

Deno.test({
  name: "dropTest",
  fn: async (): Promise<void> => {
    assertResources(defaultResources);

    await fetch("https://google.com");
    // rid: 8 for `fetchResponseBody` indicates that there
    // were multiple resources created by `fetch` internally.
    // This might change in future versions of Deno.
    assertResources({ ...defaultResources, "8": "fetchResponseBody" });

    drop(FetchResource);
    assertResources(defaultResources);
  },
});

Deno.test({
  name: "dropTestEncoding",
  fn: (): void => {
    assertResources(defaultResources);

    const decoder = new TextDecoder();
    decoder.decode(new Uint8Array([1, 2, 3]), { stream: true });

    assertResources({ ...defaultResources, "9": "textDecoder" });

    drop(TextDecoderResource);
    assertResources(defaultResources);
  },
});
