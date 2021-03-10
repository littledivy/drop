import { drop, FetchResource } from "../mod.ts";

async function addNewResource() {
  // XXX: Does not automatically spin up a server for this run.
  //      You will have to do it yourself before executing this.
  //      Ex: `python -m SimpleHTTPServer`
  return await fetch("http://localhost:8000/images.png");
}

for (let i = 0; i < 1e4; i++) {
  await addNewResource();
  // Uncomment the below line to see how much memory it normally takes.
  // (depends on size of file being fetched)
  //
  // With `drop`              : 17.8mb
  // Without `drop` (default) : 200.1mb
  drop(FetchResource);
}
