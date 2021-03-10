import { Resource } from "./resources.ts";

export function drop(resource: Resource): boolean {
  const rt: Deno.ResourceMap = Deno.resources();
  for (const rid in rt) {
    if (rt[rid] == resource.name) {
      Deno.close(Number(rid));
      return true;
    }
  }
  return false;
}
