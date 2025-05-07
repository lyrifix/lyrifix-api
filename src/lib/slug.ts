import slugify from "slugify";

export function createSlugify(text: string): string {
  return slugify(text, { lower: true });
}
