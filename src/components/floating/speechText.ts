/** A spoken copy only. Never apply this to the chat message or knowledge source. */
export function sanitizeSpeechText(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\b(?:https?:\/\/|www\.|mailto:)[^\s<>]+/gi, " ")
    .replace(/^[\t ]*(?:#{1,6}\s+|>\s*|[-*+•]\s+|\d+[.)]\s+)/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/[™®©]/g, "")
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
    .replace(/&amp;/gi, "and")
    .replace(/&(?:nbsp|lt|gt|quot|apos);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
