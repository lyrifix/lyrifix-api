import { customAlphabet } from "nanoid";
import slugify from "slugify";

function generateUniqueId() {
  return customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10)();
}

export function createSlug(text: string): string {
  const result = slugify(text, { lower: true });
  if (!result) return generateUniqueId();
  return result;
}

export function createExtraSlug(n: number = 5) {
  return generateUniqueId();
}
