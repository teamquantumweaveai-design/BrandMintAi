// Voice-only spelling rules for the existing eight approved replies. This is
// deliberately not a paraphrase matcher or a general words-to-numbers parser.
// Chat text, knowledge selection and the exact HTTP allowlist remain untouched.
const PHONE_SPOKEN = 'plus nine one nine nine seven two nine six five six seven seven';
const PHONE_DIGITS = /(?<![\p{L}\p{N}+\-.,])(?:\+\s*|plus\s+)9(?:\s+|-)?1(?:\s+|-)?9(?:\s+|-)?9(?:\s+|-)?7(?:\s+|-)?2(?:\s+|-)?9(?:\s+|-)?6(?:\s+|-)?5(?:\s+|-)?6(?:\s+|-)?7(?:\s+|-)?7(?![\s-]*\p{N}|\p{L})/giu;

/** Make only pronunciation/orthography changes to an already-sanitized copy. */
export function prepareReadoutText(text) {
  return text.normalize('NFC')
    .replace(/’/g, "'").replace(/−/g, '-')
    .replace(/&amp;|&/gi, ' and ')
    .replace(/\bBrand\s*Mint\b/gi, 'Brand Mint')
    .replace(/\bWhats\s*App\b/gi, 'WhatsApp')
    .replace(/\bA[.\s]*I\b/gi, 'A I')
    .replace(/\bC[.\s]*R[.\s]*M\b/gi, 'C R M')
    .replace(/\bR[.\s]*O[.\s]*I\b/gi, 'R O I')
    .replace(/\bI[.\s]*P\b/gi, 'I P')
    // Bounded numeric phrases actually present in the current replies. The
    // boundaries exclude signed numbers, fractions and larger numeric values.
    .replace(/(?<![\p{L}\p{N}+\-.,])360\s*(?:°|degrees\b)/giu, 'three hundred sixty degrees')
    .replace(/\bthree hundred and sixty degrees\b/gi, 'three hundred sixty degrees')
    .replace(/(?<![\p{L}\p{N}+\-.,])90(?:\s+|-)day\b/giu, 'ninety day')
    .replace(/(?<![\p{L}\p{N}+\-.,])1(?:-on-|\s+on\s+)1(?![\p{L}\p{N}.,])/giu, 'one on one')
    // Speak the verified contact number digit by digit. A transcript may use
    // the same digits with different grouping, but never omit the plus sign.
    .replace(PHONE_DIGITS, PHONE_SPOKEN)
    .replace(/\s+/g, ' ').trim();
}

export function normalizeReadoutText(text) {
  const spoken = prepareReadoutText(text).toLowerCase()
    // Only the contraction and regional spellings in these approved replies.
    .replace(/\bwe'll\b/g, 'we will')
    .replace(/\bspecialises\b/g, 'specializes')
    .replace(/\bsynchronisation\b/g, 'synchronization')
    .replace(/\benquiries\b/g, 'inquiries')
    // Word hyphens are orthography; standalone signs and numeric signs are
    // retained below. There is no edit distance, word deletion or reordering.
    .replace(/(?<=\p{L})-(?=\p{L})/gu, ' ')
    .replace(/([+-])\s+(?=\p{N})/gu, '$1');
  return (spoken.match(/[+-]?\p{N}+(?:[.,]\p{N}+)*|\p{L}+(?:'\p{L}+)*|[\p{Sc}%‰‱=<>×÷°+-]/gu) || []).join(' ');
}
