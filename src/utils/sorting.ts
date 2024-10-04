/**
 * Functions for implementing lexicographical sorting.
 * https://stackoverflow.com/questions/38923376/return-a-new-string-that-sorts-between-two-given-strings
 */

/**
 * Create the middle string between the prev string and the next string.
 * @param prev The prev string.
 * @param next The next string.
 * @returns The string between prev and next.
 */
export function midString(prev: string, next: string) {
  let p = 0;
  let n = 0;
  let pos = 0;
  for (pos; p === n; pos++) {
    // find leftmost non-matching character
    p = pos < prev.length ? prev.charCodeAt(pos) : 96;
    n = pos < next.length ? next.charCodeAt(pos) : 123;
  }
  let str = prev.slice(0, pos - 1); // copy identical part of string
  if (p === 96) {
    // prev string equals beginning of next
    while (n === 97) {
      // next character is 'a'
      n = pos < next.length ? next.charCodeAt(pos++) : 123; // get char from next
      str += "a"; // insert an 'a' to match the 'a'
    }
    if (n === 98) {
      // next character is 'b'
      str += "a"; // insert an 'a' to match the 'b'
      n = 123; // set to end of alphabet
    }
  } else if (p + 1 === n) {
    // found consecutive characters
    str += String.fromCharCode(p); // insert character from prev
    n = 123; // set to end of alphabet
    while ((p = pos < prev.length ? prev.charCodeAt(pos++) : 96) === 122) {
      // p='z'
      str += "z"; // insert 'z' to match 'z'
    }
  }
  return str + String.fromCharCode(Math.ceil((p + n) / 2)); // append middle character
}

/**
 * Generate lexicographically equally-spaced keys. For resetting the keys of a sorted list.
 * @param num The number of strings to generate.
 * @returns The list of strings.
 */
export function seqString(num: number) {
  if (num < 1) {
    return [];
  }

  const chars = Math.floor(Math.log(num) / Math.log(26)) + 1;
  const prev = Math.pow(26, chars - 1);
  const ratio = chars > 1 ? (num + 1 - prev) / prev : num;
  const part = Math.floor(ratio);
  const alpha = [partialAlphabet(part), partialAlphabet(part + 1)];
  const leapStep = ratio % 1;
  let leapTotal = 0.5;
  let first = true;
  const strings: string[] = [];
  generateStrings(chars - 1, "");
  return strings;

  function generateStrings(full: number, str: string) {
    if (full) {
      for (let i = 0; i < 26; i++) {
        generateStrings(full - 1, str + String.fromCharCode(97 + i));
      }
    } else {
      if (!first) strings.push(stripTrailingAs(str));
      else first = false;
      const leap = Math.floor((leapTotal += leapStep));
      leapTotal %= 1;
      for (let i = 0; i < part + leap; i++) {
        strings.push(str + alpha?.[leap]?.[i]);
      }
    }
  }

  function stripTrailingAs(str: string) {
    let last = str.length - 1;
    while (str.charAt(last) === "a") --last;
    return str.slice(0, last + 1);
  }

  function partialAlphabet(num: number) {
    const magic = [
      0, 4096, 65792, 528416, 1081872, 2167048, 2376776, 4756004, 4794660,
      5411476, 9775442, 11097386, 11184810, 22369621,
    ];
    let bits = num < 13 ? (magic[num] ?? 0) : 33554431 - (magic[25 - num] ?? 0);
    const chars = [];
    for (let i = 1; i < 26; i++, bits >>= 1) {
      if (bits & 1) chars.push(String.fromCharCode(97 + i));
    }
    return chars;
  }
}
