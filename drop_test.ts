import { assertEquals } from "https://deno.land/std@0.89.0/testing/asserts.ts";

import { drop } from "./drop.ts";
import { FetchResource } from "./resources.ts";

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
    // rid: 6 for `fetchResponseBody` indicates that there
    // were multiple op calls performed by `fetch` internally.
    // This might change in future versions of Deno.
    assertResources({ ...defaultResources, "6": "fetchResponseBody" });

    drop(FetchResource);
    assertResources(defaultResources);
  },
});
