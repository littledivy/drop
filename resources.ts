export enum Category {
  Fetch,
  WebGPU,
  Encoding,
}

export interface Resource {
  name: string;
  category: Category;
}

export const FetchResource: Resource = {
  name: "fetchResponseBody",
  category: Category.Fetch,
};

export const TextDecoderResource: Resource = {
  name: "textDecoder",
  category: Category.Encoding,
};

export const GPUAdapterResource: Resource = {
  name: "webGPUAdapter",
  category: Category.WebGPU,
};

export const Resources: Resource[] = [FetchResource];
