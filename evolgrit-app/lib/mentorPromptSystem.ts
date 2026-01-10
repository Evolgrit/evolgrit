export type MentorContext = { mood?: string; situation?: string };

export function getChatPlaceholder(context?: MentorContext): string {
  if (context?.mood === "stressed") return "Type when you’re ready.";
  if (context?.mood === "no_time") return "Keep it short. A few words are enough.";
  return "Reply when ready";
}

export type SystemMessageType = "start" | "welcome_back" | "motivation" | "task" | "confirmation";

export function getMentorSystemMessage(type: SystemMessageType, context?: MentorContext): string {
  switch (type) {
    case "start":
      return "Let’s take this step by step. One small action today is enough.";
    case "welcome_back":
      return "Welcome back. We’ll continue gently.";
    case "motivation":
      return "Progress doesn’t need pressure.";
    case "task":
      return getNextActionSuggestion(context);
    case "confirmation":
      return "Good. Keep it simple. One more sentence is enough.";
    default:
      return "Let’s take this step by step. One small action today is enough.";
  }
}

export function getNextActionSuggestion(context?: MentorContext): string {
  const situation = context?.situation ?? "your situation";
  return `Today: one 3-minute speaking drill about ${situation}.`;
}
