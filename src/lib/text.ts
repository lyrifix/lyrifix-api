export function prepareText(text: string): string {
  // Remove leading/trailing whitespace and replace all types of line breaks with \n
  return text.trim().replace(/\r?\n/g, "\n");
}
