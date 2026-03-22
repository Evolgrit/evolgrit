import type { Avatar } from "../../types/avatars";

export function loadAvatars(): Avatar[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../../content/avatars/index.json") as Avatar[];
}
