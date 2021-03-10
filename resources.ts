export enum Category {
  Fetch,
  WebGPU,
  WebCrypto,
}

export interface Resource {
  name: string;
  category: Category;
}

export const FetchResource: Resource = {
  name: "fetchResponseBody",
  category: Category.Fetch,
};

export const Resources: Resource[] = [FetchResource];
