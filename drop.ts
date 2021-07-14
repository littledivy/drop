import { GPUAdapterResource, Resource } from "./resources.ts";

type Rid = number;

// deno-lint-ignore no-explicit-any
function _isResource(maybeResource: any) {
  // XXX: Better way to test if parameter is Resource object?
  return typeof maybeResource == "object" && !!maybeResource.name;
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
  } // *Magically* determine resource ID from instance :eyes:
  else if (
    // https://github.com/denoland/deno/blob/10b99e8eb0e04e8340187b8aafe860405114d0d7/op_crates/fetch/26_fetch.js#L870
    // @ts-ignore Ignore `--unstable` not detected diagnostic.
    (Deno.HttpClient && resource instanceof Deno.HttpClient) ||
    // https://github.com/denoland/deno/blob/10b99e8eb0e04e8340187b8aafe860405114d0d7/op_crates/websocket/01_websocket.js#L258.
    (WebSocket && resource instanceof WebSocket) ||
    // https://github.com/denoland/deno/blob/10b99e8eb0e04e8340187b8aafe860405114d0d7/runtime/js/30_files.js#L106
    (Deno.File && resource instanceof Deno.File)
  ) {
    resource.close();
    return true;
  } else if (
    // https://gpuweb.github.io/gpuweb/#dom-gpudevice-destroy
    (GPUDevice && resource instanceof GPUDevice) ||
    // https://gpuweb.github.io/gpuweb/#dom-gputexture-destroy
    (GPUTexture && resource instanceof GPUTexture) ||
    // https://gpuweb.github.io/gpuweb/#dom-gpubuffer-destroy
    (GPUBuffer && resource instanceof GPUBuffer) ||
    // https://gpuweb.github.io/gpuweb/#dom-gpuqueryset-destroy
    (GPUQuerySet && resource instanceof GPUQuerySet)
  ) {
    resource.destroy();
    return true;
  } else if (Worker && resource instanceof Worker) {
    resource.terminate();
    return true;
    // @ts-ignore Ignore `--unstable` diagnostics
  } else if (Deno.SignalStream && resource instanceof Deno.SignalStream) {
    resource.dispose();
    return true;
  } else if (GPUAdapter && resource instanceof GPUAdapter) {
    return drop(GPUAdapterResource);
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
  // https://github.com/denoland/deno/blob/10b99e8eb0e04e8340187b8aafe860405114d0d7/runtime/js/40_fs_events.js#L16
  // XXX add links for: https://github.com/denoland/deno/blob/10b99e8eb0e04e8340187b8aafe860405114d0d7/runtime/js/39_net.js
  if (
    // https://github.com/denoland/deno/blob/10b99e8eb0e04e8340187b8aafe860405114d0d7/runtime/js/40_process.js#L38
    (Deno.Process && resource instanceof Deno.Process)
    // XXX: Deno does not include the below classes in its namespace.
    // (Deno.Conn && resource instanceof Deno.Conn) ||
    // (Deno.Listener && resource instanceof Deno.Listener)
    // (Deno.Datagram && resource instanceof Deno.Datagram)
  ) {
    if (Object.getOwnPropertyDescriptor(resource, "rid")!["get"]) {
      try {
        Deno.close(resource.rid);
        return true;
      } catch (_) {
        return false;
      }
    }
  }
  return false;
}
