## `deno_drop`

![](https://i.imgur.com/AumwQ4y.png)

Manage your programs resource memory. Check out its
[impact on memory usage](#impact)

### Impact

Here we have a long running loop pinging a local server. The request is stored
as a resource in Deno's internal resource table.

```typescript
import { drop, FetchResource } from "https://deno.land/x/drop@1.8.1/mod.ts";

for (let i = 0; i < 1e4; i++) {
  await fetch("http://localhost:8000/images.png");
  // With `drop`              : 17.8mb
  // Without `drop` (default) : 200.1mb
  drop(FetchResource);
}
```

Doing this will create `1e4` resources for every request made. Which can take up
a LOT of memory.

By adding the `drop(FetchResource)`, you will notice the memory consumption
decrease drastically.

### License

MIT
