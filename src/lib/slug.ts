import { customAlphabet } from "nanoid";
import slugify from "slugify";

export function createSlugify(text: string): string {
  return slugify(text, { lower: true });
}

export function createExtraSlug(n: number = 5) {
  const extraSlug = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n);

  return extraSlug();
}
