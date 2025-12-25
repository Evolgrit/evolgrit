export type MentorMessage = {
  id: string;
  sender_type: "learner" | "mentor";
  content: string;
  created_at: string;
};
