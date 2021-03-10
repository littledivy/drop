// Every release for `drop` is locked to a specific version
// of Deno. Hence, this source is guranteed to work with
// the below specified version.
//
// This is needed because tests and resource names are not part
// of the Deno public API and can change/break in other version.
export const DENO_VERSION = "1.8.1";
