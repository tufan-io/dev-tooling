import test from "ava";
import { markdownReplacer } from "../markdown-replacer";
import { input } from "./fixtures/md-input";

test(`markdown-replacer`, (t) => {
  t.snapshot(markdownReplacer(
    input,
    "[CLOC reports](./cloc.md)",
    "[CLOC reports](./replacer-test/cloc.md)"));
});
