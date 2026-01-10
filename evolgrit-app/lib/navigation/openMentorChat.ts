import { Router } from "expo-router";

/**
 * Navigate to the single mentor chat thread.
 * This keeps all entry points consistent.
 */
export function openMentorChat(router: Router) {
  router.push("/chat/mentor-default");
}
