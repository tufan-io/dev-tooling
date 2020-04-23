
export function regexpReplacer(
  source: string,
  matchAndReplace: { match: RegExp, replace: string }[],
) {
  matchAndReplace.forEach(({ match, replace }) => {
    source = source.replace(match, replace);
  });
  return source;
}
