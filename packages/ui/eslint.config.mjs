import reactLibrary from "@appbit/eslint-config/react-library";

export default [
  ...reactLibrary,
  {
    ignores: ["storybook-static/**", "!.storybook"],
  },
];
