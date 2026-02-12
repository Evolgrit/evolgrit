import { DEV_UNLOCK_ALL } from "../config/devFlags";

export type ItemStatus = "available" | "locked" | "done" | "recommended";

export function applyDevUnlock(status: ItemStatus): ItemStatus {
  return DEV_UNLOCK_ALL ? "available" : status;
}
