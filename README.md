## `deno_drop`

![](https://i.imgur.com/AumwQ4y.png)

Manage your programs resource memory. Check out its
[impact on memory usage](#impact)


> **Do not use in production** - A lot of the code depends on internal Deno APIs that can change anytime. Intead, consider consuming your resources (like `await response.arrayBuffer()` on `Response`) to free up memory.

### Impact

Here we have a long running loop pinging a local server. The request is stored
as a resource in Deno's internal resource table.

```typescript
import { drop, FetchResource } from "https://deno.land/x/drop@1.12.0/mod.ts";

for (let i = 0; i < 1e4; i++) {
  await fetch("http://localhost:8000/images.png");
  // With `drop`              : 17.8mb
  // Without `drop` (default) : 200.1mb
  drop(FetchResource);
}
```

Doing this will create `10000` resources for every request made. Which can take
up a LOT of memory.

By adding the `drop(FetchResource)`, you will notice the memory consumption
decrease drastically.

### Examples

```typescript
import {
  drop,
  TextDecoderResource,
} from "https://deno.land/x/drop@1.12.0/mod.ts";

const decoder = new TextDecoder();
decoder.decode(new Uint8Array([1, 2, 3]), { stream: true });

drop(TextDecoderResource);
```

```typescript
import { drop } from "https://deno.land/x/drop@1.12.0/mod.ts";

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

drop(device);
drop(adapter);
```

### License

MIT
