# Evolgrit App Architecture (Expo + Tamagui)

This document codifies the current UI and data contracts so new work stays aligned with the light-only, calm MVP.

## Core Goals
- Production-ready MVP for German learning + readiness (iOS-native feel, calm, adult, no gamification).
- Expo + expo-router + Tamagui (no Next.js/web assumptions).
- StatusBar must remain readable in light/dark device modes.

## Global Rules
- **Screen layout**: Every screen must use `ScreenShell` + `AppHeader`. No absolute-position headers or custom SafeArea math per screen.
- **Styling**: No inline styles in screens. Use Tamagui tokens + system components only. If a new variant is needed, create/extend a system component first.
- **Content**: Home shows exactly **one** Next Action. No explore/browse patterns. No gamification (streaks, points, confetti, leaderboards).
- **Keys**: All API/AI keys server-side only. Never call OpenAI/Azure/Google directly from client.

## Design Tokens (light-only)
- Colors:  
  - bg `#F7F8FA`, card `rgba(255,255,255,0.85)`, text `#111827`, muted `#6B7280`, border `rgba(17,24,39,0.08)`  
  - primary `#1C2433`, onPrimary `#F9FAFB`, ready `#2ECC71`, focus `#F1C40F`, critical `#E74C3C`
- Radius: sm `12`, md `18`, lg `26`
- Space: xs `8`, sm `16`, md `24`, lg `32`
- Sizes: buttonHeight `48`, tabBarHeight `74`, headerHeight `56`

## Navigation Templates
- Tabs: Home, Learn, Speak, Progress, Mentor.
- Routes include: `app/(tabs)/home.tsx`, `app/(tabs)/learn.tsx`, `app/(tabs)/speak.tsx`, `app/(tabs)/progress.tsx`, stack screens for lesson/chat.
- Chat is single-thread (no inbox, no search/plus). Back: `router.back()` else `router.replace('/(tabs)/home')`.

## System Components (must exist / be reused)
- `components/system/ScreenShell.tsx`
- `components/navigation/AppHeader.tsx`
- `components/navigation/TabBar.tsx`
- `components/system/{GlassCard,PrimaryButton,SecondaryButton,PillButton,ListRow,SectionHeader,SheetBase,TextFieldBase,AlertBase,ReadinessRing}`
- Screens compose **only** system components + Tamagui primitives. System components stay stateless; screen-specific components may use hooks but must not define new styling primitives.

## Supabase Contract (public schema)
- `drills`: id, slug, level, topic, duration_sec, is_active, created_at
- `drill_lines`: id, drill_id, order_index, target_text (NOT NULL), context_title, context_hint, mentor_tip, difficulty, created_at
- `pronunciation_guides`: id, line_id, word, guide, note, created_at
- `tts_audio_assets`: id, line_id, style, url, duration_ms, voice, provider, created_at
- **Rules**: Use `pickAllowed` on DB payloads. Never write unknown columns. `drill_lines.target_text` must always be non-empty. Pronunciation guides attach via `line_id` only (never `drill_slug`).

## Readiness Engine
- ERS = min(L, A, S, C)
- Zones: critical (0–39), focus (40–69), ready (70–100) using colors above.
- Limiter: show exactly one (lowest of L/A/S/C).
- Interventions: inactive ≥3 days → shorten next action; repeated failures → simpler drill + mentor prompt; mentor reply can overwrite Next Action.

## Analytics Events
- `screen_viewed`, `next_action_shown`, `next_action_started`, `next_action_completed`, `readiness_updated`, `mentor_sheet_opened`, `mentor_question_sent`, `mentor_reply_received`, `api_error_shown`

## Screen Templates (apply ScreenShell + AppHeader)
- **Home**: One Next Action card, then Readiness, then Mentor access. No overlap with TabBar (add paddingBottom).
- **Learn**: Structured lesson list grouped by level/week. No inline styles.
- **Speak**: Dialog practice uses system components + tokens; pronunciation guides under lines.
- **Progress**: Readiness detail + breakdown + short trend. No leaderboards/comparisons.
- **Chat**: Single mentor thread. No inbox, no search, no plus. One header title only.

## Non-goals
- No browsing library, no gamification, no employer matching UI, no full dark theme (but StatusBar readable in dark device mode).

## Implementation Notes
- Build system components first, then screens.
- Prefer composition over duplication.
- If unclear, make a reasonable assumption and note it in code comments near the component/screen entry point.
