export type TtsConfig = {
  provider: "azure";
  voice: string;
  rate: string;
};

export type PromptStyle = {
  tone: string;
  rules: string[];
};

export type Avatar = {
  id: string;
  name: string;
  vibe: string;
  description: string;
  tts: TtsConfig;
  promptStyle: PromptStyle;
};
