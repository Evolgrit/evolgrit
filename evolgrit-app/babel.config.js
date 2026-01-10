const path = require("path");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          // use absolute path so extractor never falls back to tamagui.config.ts
          config: path.join(__dirname, "tamagui.config.cjs"),
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
