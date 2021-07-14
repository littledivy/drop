import { drop } from "./mod.ts";

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

console.log(Deno.resources());

drop(adapter);

drop(device);

console.log(Deno.resources());
