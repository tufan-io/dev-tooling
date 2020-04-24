/**
 * findAndReplace "searchFor" with "replaceWith" in "source".
 * This is an quick hack, so matcher is a bit dumb. To make
 * things work, it's best to use to the smallest possible
 * snippet of text to replace. Specifically, it's best to use
 * not use list items, unless the whole list is being replaced.
 *
 * @param source  the markdown string to operate upon
 * @param searchFor  the markdown snippet to searchFor
 * @param replaceWith  the markdown snippet to replaceWith
 */
export declare function markdownReplacer(source: string, searchFor: string, replaceWith: string): string;
