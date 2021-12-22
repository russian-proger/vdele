/**
 * @param {string} _pattern 
 * @param {string} _text 
 */
export function isSubString(_pattern, _text, calc_case=false) {
  let pattern = _pattern, text = _text;
  if (!calc_case) pattern = _pattern.toLowerCase(), text = _text.toLowerCase();
  let i = 0;
  for (let j = 0; j < text.length && i < pattern.length; ++j) {
    if (text[j] == pattern[i]) ++i;
  }
  return i == pattern.length;
}