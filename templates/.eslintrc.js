module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:eslint-comments/recommended",
  ],
  rules: {
    "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
    "@typescript-eslint/no-unused-vars": [
      2,
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
};
