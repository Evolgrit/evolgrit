import type { Lesson } from "./schema";

export const A2_COURSE: Lesson[] = [
  {
    id: "a2_schedule_meeting",
    level: "A2",
    title: "Schedule a meeting time",
    capability: "schedule_time",
    tags: ["work", "time"],
    steps: [
      { type: "context", text: "You need to agree on a time." },
      { type: "speak_free", prompt: "What do you say now?" },
      { type: "feedback", ok: "You can suggest a time.", retry: "Try again with a clearer time." },
      { type: "hint", text: "Offer one option, then ask." },
      { type: "speak_guided", sentence: "Does 10 a.m. work for you?" },
      { type: "done", identity: "You can now suggest and confirm a time." },
    ],
  },

  {
    id: "a2_explain_problem_simple",
    level: "A2",
    title: "Explain a simple problem",
    capability: "explain_problem",
    tags: ["work", "daily_life"],
    steps: [
      { type: "context", text: "Something is not working." },
      { type: "speak_free", prompt: "What do you say now?" },
      { type: "feedback", ok: "You can explain a simple problem.", retry: "Try again with a clearer key detail." },
      { type: "hint", text: "Problem + help request is enough." },
      { type: "speak_guided", sentence: "Sorry, this doesn’t work. Can you help me?" },
      { type: "done", identity: "You can now explain a simple problem politely." },
    ],
  },

  {
    id: "a2_work_request_clarification",
    level: "A2",
    title: "Ask for clarification at work",
    capability: "clarify_work",
    tags: ["work", "confidence"],
    steps: [
      { type: "context", text: "You didn’t understand an instruction." },
      { type: "speak_free", prompt: "What do you say now?" },
      { type: "feedback", ok: "You can ask for clarification.", retry: "Try again with a clearer question." },
      { type: "hint", text: "Use: “Can you explain…?”" },
      { type: "speak_guided", sentence: "Can you explain that again, please?" },
      { type: "done", identity: "You can now ask for clarification at work." },
    ],
  },

  {
    id: "a2_phone_call_polite",
    level: "A2",
    title: "Make a polite phone call",
    capability: "phone_polite",
    tags: ["phone", "daily_life"],
    steps: [
      { type: "context", text: "You call to ask a question." },
      { type: "speak_free", prompt: "How do you start the call?" },
      { type: "feedback", ok: "You can start a phone call politely.", retry: "Try again with a clearer greeting." },
      { type: "hint", text: "Greeting + your name is enough." },
      { type: "speak_guided", sentence: "Hello, my name is Daniel. I have a question." },
      { type: "done", identity: "You can now start a polite phone call." },
    ],
  },

  {
    id: "a2_smalltalk_weekend",
    level: "A2",
    title: "Simple smalltalk (weekend)",
    capability: "smalltalk_weekend",
    tags: ["social", "work"],
    steps: [
      { type: "context", text: "A colleague asks about your weekend." },
      { type: "speak_free", prompt: "What do you say?" },
      { type: "feedback", ok: "You can answer with a simple sentence.", retry: "Try again with one simple sentence." },
      { type: "hint", text: "One sentence is enough." },
      { type: "speak_guided", sentence: "It was good. I rested a lot." },
      { type: "done", identity: "You can now do simple smalltalk about your weekend." },
    ],
  },

  {
    id: "a2_job_interview_intro",
    level: "A2",
    title: "Job interview: short introduction",
    capability: "interview_intro",
    tags: ["work", "jobs"],
    steps: [
      { type: "context", text: "You start a job interview." },
      { type: "speak_free", prompt: "How do you introduce yourself?" },
      { type: "feedback", ok: "You can introduce yourself in an interview.", retry: "Try again with a clearer role/goal." },
      { type: "hint", text: "Name + experience + goal." },
      { type: "speak_guided", sentence: "My name is Daniel. I have experience in logistics. I’m looking for a job." },
      { type: "done", identity: "You can now introduce yourself in a job interview." },
    ],
  },

  {
    id: "a2_work_safety_question",
    level: "A2",
    title: "Work: safety question",
    capability: "work_safety",
    tags: ["work", "safety"],
    steps: [
      { type: "context", text: "You are unsure about a safety rule." },
      { type: "speak_free", prompt: "What do you say?" },
      { type: "feedback", ok: "You can ask a safety question.", retry: "Try again with a clearer question." },
      { type: "hint", text: "Ask first, then confirm." },
      { type: "speak_guided", sentence: "Is it okay if I do it like this?" },
      { type: "done", identity: "You can now ask about safety at work." },
    ],
  },

  {
    id: "a2_complain_polite",
    level: "A2",
    title: "Make a polite complaint",
    capability: "complain_polite",
    tags: ["daily_life", "confidence"],
    steps: [
      { type: "context", text: "Something is wrong with a product." },
      { type: "speak_free", prompt: "What do you say?" },
      { type: "feedback", ok: "You can complain politely.", retry: "Try again with a calmer tone." },
      { type: "hint", text: "State problem + request." },
      { type: "speak_guided", sentence: "Sorry, this is not correct. Can we change it?" },
      { type: "done", identity: "You can now complain politely and request a solution." },
    ],
  },

  {
    id: "a2_fill_form_basic",
    level: "A2",
    title: "Forms: basic information",
    capability: "forms_basic",
    tags: ["forms", "daily_life"],
    steps: [
      { type: "context", text: "You fill in a form." },
      { type: "speak_free", prompt: "How do you answer a simple question?" },
      { type: "feedback", ok: "You can give basic personal information.", retry: "Try again with a clearer sentence." },
      { type: "hint", text: "Keep it simple." },
      { type: "speak_guided", sentence: "My address is… / My phone number is…" },
      { type: "done", identity: "You can now provide basic information for forms." },
    ],
  },

  {
    id: "a2_make_plan_today",
    level: "A2",
    title: "Plan your day",
    capability: "plan_day",
    tags: ["daily_life", "time"],
    steps: [
      { type: "context", text: "You talk about your plan today." },
      { type: "speak_free", prompt: "What do you say?" },
      { type: "feedback", ok: "You can describe a simple plan.", retry: "Try again with time + action." },
      { type: "hint", text: "Time + activity." },
      { type: "speak_guided", sentence: "Today I work until 4, then I go home." },
      { type: "done", identity: "You can now describe a simple plan for the day." },
    ],
  },

  {
    id: "a2_handle_misunderstanding",
    level: "A2",
    title: "Fix a misunderstanding",
    capability: "fix_misunderstanding",
    tags: ["confidence", "daily_life"],
    steps: [
      { type: "context", text: "There is a misunderstanding." },
      { type: "speak_free", prompt: "What do you say?" },
      { type: "feedback", ok: "You can fix a misunderstanding calmly.", retry: "Try again with a calmer sentence." },
      { type: "hint", text: "Clarify without blaming." },
      { type: "speak_guided", sentence: "Sorry, I meant something else. Can we try again?" },
      { type: "done", identity: "You can now fix a misunderstanding calmly." },
    ],
  },
];
