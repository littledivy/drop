import { Resource } from "./resources.ts";

type Rid = number;

// deno-lint-ignore no-explicit-any
function _isResource(maybeResource: any) {
  // XXX: Better way to test if parameter is Resource object?
  return typeof maybeResource == "object" && maybeResource.name &&
    maybeResource.category;
}

// deno-lint-ignore no-explicit-any
export function drop(resource: Resource | Rid | any): boolean {
  if (typeof resource == "number") {
    try {
      Deno.close(resource);
      return true;
    } catch (_) {
      return false;
    }
  } else if (_isResource(resource)) {
    const rt: Deno.ResourceMap = Deno.resources();
    for (const rid in rt) {
      if (rt[rid] == resource.name) {
        Deno.close(Number(rid));
        return true;
      }
    }
    return false;
  }
  // *Magically* determine resource ID from instance :eyes:
  // @ts-ignore Ignore `--unstable` not detected diagnostic.
  if (Deno.HttpClient && resource instanceof Deno.HttpClient) {
    // https://github.com/denoland/deno/blob/10b99e8eb0e04e8340187b8aafe860405114d0d7/op_crates/fetch/26_fetch.js#L870
    resource.close();
    return true;
  } 
  return false;
}
