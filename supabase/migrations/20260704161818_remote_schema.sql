


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end $$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."access_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "kind" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approved_at" timestamp with time zone,
    CONSTRAINT "access_requests_kind_check" CHECK (("kind" = ANY (ARRAY['learner'::"text", 'employer'::"text"]))),
    CONSTRAINT "access_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."access_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."admin_audit_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "actor_id" "uuid",
    "action" "text" NOT NULL,
    "target" "text",
    "meta" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_audit_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."batch_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "batch_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'learner'::"text" NOT NULL
);


ALTER TABLE "public"."batch_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."batches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "starts_on" "date",
    "ends_on" "date",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL
);


ALTER TABLE "public"."batches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_attachments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "message_id" "uuid" NOT NULL,
    "thread_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "kind" "text" NOT NULL,
    "storage_bucket" "text" DEFAULT 'chat-media'::"text" NOT NULL,
    "storage_path" "text" NOT NULL,
    "mime_type" "text",
    "file_name" "text",
    "size_bytes" bigint,
    "width" integer,
    "height" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chat_attachments_kind_check" CHECK (("kind" = ANY (ARRAY['image'::"text", 'file'::"text"])))
);


ALTER TABLE "public"."chat_attachments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "thread_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "body" "text" NOT NULL
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_threads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "learner_id" "uuid" NOT NULL,
    "mentor_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_threads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "bucket_id" "text" DEFAULT 'documents'::"text" NOT NULL,
    "object_path" "text" NOT NULL,
    "category" "text" NOT NULL,
    "doc_type" "text" DEFAULT 'other'::"text" NOT NULL,
    "title" "text",
    "file_name" "text",
    "mime_type" "text",
    "size_bytes" bigint,
    "status" "text" DEFAULT 'uploaded'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "documents_doc_type_check" CHECK (("doc_type" = ANY (ARRAY['pdf'::"text", 'image'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."drill_lines" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "drill_id" "uuid" NOT NULL,
    "order_index" integer DEFAULT 0 NOT NULL,
    "context_title" "text",
    "context_hint" "text",
    "target_text" "text" DEFAULT ''::"text",
    "mentor_tip" "text",
    "difficulty" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "drill_lines_difficulty_check" CHECK ((("difficulty" >= 1) AND ("difficulty" <= 5)))
);


ALTER TABLE "public"."drill_lines" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."drills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "level" "text" NOT NULL,
    "topic" "text" NOT NULL,
    "duration_sec" integer DEFAULT 180 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    CONSTRAINT "drills_level_check" CHECK (("level" = ANY (ARRAY['A1'::"text", 'A2'::"text", 'B1'::"text", 'B2'::"text", 'C1'::"text", 'C2'::"text"])))
);


ALTER TABLE "public"."drills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."education_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "institution" "text" NOT NULL,
    "degree" "text",
    "field" "text",
    "start_date" "date",
    "end_date" "date",
    "is_current" boolean DEFAULT false NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."education_entries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employer_candidate_actions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "employer_id" "uuid" NOT NULL,
    "learner_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "employer_candidate_actions_action_check" CHECK (("action" = ANY (ARRAY['saved'::"text", 'interested'::"text", 'intro_requested'::"text"])))
);


ALTER TABLE "public"."employer_candidate_actions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employer_leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "company" "text" NOT NULL,
    "role_types" "text" NOT NULL,
    "email" "text" NOT NULL,
    "normalized_roles" "text",
    "priority" boolean DEFAULT false NOT NULL,
    "followup_2d_sent_at" timestamp with time zone,
    "email_confirmed_at" timestamp with time zone
);


ALTER TABLE "public"."employer_leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."module_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "module_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'todo'::"text" NOT NULL,
    "completed_at" timestamp with time zone
);


ALTER TABLE "public"."module_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "kind" "text" DEFAULT 'lesson'::"text" NOT NULL,
    "phase" "text",
    "order_index" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profile_languages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "kind" "text" NOT NULL,
    "language" "text" NOT NULL,
    "level" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "profile_languages_kind_check" CHECK (("kind" = ANY (ARRAY['mother_tongue'::"text", 'other'::"text", 'german'::"text"])))
);


ALTER TABLE "public"."profile_languages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "birthday" "date",
    "mother_tongue" "text",
    "other_languages" "text",
    "german_level" "text",
    "current_country" "text",
    "origin_country" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "target" "text",
    "role" "text" DEFAULT 'learner'::"text" NOT NULL,
    "onboarding_completed_at" timestamp with time zone,
    "target_in_germany" "text",
    "start_timeframe" "text",
    "target_roles" "text"[],
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['learner'::"text", 'employer'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."weekly_checkins" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "week_start" "date" NOT NULL,
    "mood" "text",
    "hours" integer,
    "wins" "text",
    "blockers" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."weekly_checkins" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."employer_readiness_view" WITH ("security_invoker"='true') AS
 SELECT "id" AS "learner_id",
    "full_name",
    "current_country",
    "target_roles",
    "onboarding_completed_at",
    ( SELECT "pl"."level"
           FROM "public"."profile_languages" "pl"
          WHERE (("pl"."profile_id" = "p"."id") AND ("pl"."kind" = 'german'::"text"))
         LIMIT 1) AS "german_level",
    ( SELECT "count"(*) AS "count"
           FROM ("public"."module_progress" "mp"
             JOIN "public"."modules" "m" ON (("m"."id" = "mp"."module_id")))
          WHERE (("mp"."user_id" = "p"."id") AND ("mp"."status" = 'completed'::"text") AND ("m"."is_active" = true))) AS "modules_completed",
    ( SELECT "count"(*) AS "count"
           FROM "public"."modules" "m"
          WHERE ("m"."is_active" = true)) AS "modules_total",
    ( SELECT "max"("wc"."week_start") AS "max"
           FROM "public"."weekly_checkins" "wc"
          WHERE ("wc"."user_id" = "p"."id")) AS "last_checkin_week",
    ( SELECT "count"(*) AS "count"
           FROM "public"."documents" "d"
          WHERE (("d"."user_id" = "p"."id") AND ("d"."status" = 'uploaded'::"text"))) AS "documents_count",
    (((
        CASE
            WHEN ("onboarding_completed_at" IS NOT NULL) THEN 30
            ELSE 0
        END +
        CASE
            WHEN (( SELECT "count"(*) AS "count"
               FROM "public"."modules" "m"
              WHERE ("m"."is_active" = true)) = 0) THEN 0
            ELSE LEAST(30, ("round"(((30)::numeric * ((( SELECT "count"(*) AS "count"
               FROM ("public"."module_progress" "mp"
                 JOIN "public"."modules" "m" ON (("m"."id" = "mp"."module_id")))
              WHERE (("mp"."user_id" = "p"."id") AND ("mp"."status" = 'completed'::"text") AND ("m"."is_active" = true))))::numeric / (( SELECT "count"(*) AS "count"
               FROM "public"."modules" "m"
              WHERE ("m"."is_active" = true)))::numeric))))::integer)
        END) +
        CASE
            WHEN (( SELECT "count"(*) AS "count"
               FROM "public"."weekly_checkins" "wc"
              WHERE (("wc"."user_id" = "p"."id") AND ("wc"."week_start" >= (CURRENT_DATE - '42 days'::interval)))) > 0) THEN 20
            ELSE 0
        END) +
        CASE
            WHEN (( SELECT "count"(*) AS "count"
               FROM "public"."documents" "d"
              WHERE (("d"."user_id" = "p"."id") AND ("d"."status" = 'uploaded'::"text"))) > 0) THEN 20
            ELSE 0
        END) AS "readiness_score"
   FROM "public"."profiles" "p"
  WHERE ("role" = 'learner'::"text");


ALTER VIEW "public"."employer_readiness_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."journey_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "body" "text",
    "kind" "text" DEFAULT 'milestone'::"text"
);


ALTER TABLE "public"."journey_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mentor_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "thread_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "body" "text" NOT NULL
);


ALTER TABLE "public"."mentor_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mentor_threads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "learner_id" "uuid" NOT NULL,
    "mentor_id" "uuid",
    "status" "text" DEFAULT 'open'::"text" NOT NULL
);


ALTER TABLE "public"."mentor_threads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profile_skills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "skill" "text" NOT NULL,
    "level" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profile_skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pronunciation_guides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "line_id" "uuid" NOT NULL,
    "word" "text" NOT NULL,
    "guide" "text" NOT NULL,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."pronunciation_guides" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."readiness_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "event_type" "text" NOT NULL,
    "event_value" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."readiness_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tts_audio_assets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "line_id" "uuid" NOT NULL,
    "voice_provider" "text" NOT NULL,
    "voice_id" "text" NOT NULL,
    "style" "text" NOT NULL,
    "ssml_hash" "text" NOT NULL,
    "storage_path" "text" NOT NULL,
    "duration_ms" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "tts_audio_assets_style_check" CHECK (("style" = ANY (ARRAY['normal'::"text", 'slow'::"text", 'teaching'::"text"]))),
    CONSTRAINT "tts_audio_assets_voice_provider_check" CHECK (("voice_provider" = ANY (ARRAY['azure'::"text", 'google'::"text", 'aws'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."tts_audio_assets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tts_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "line_id" "uuid" NOT NULL,
    "style" "text" NOT NULL,
    "status" "text" DEFAULT 'queued'::"text" NOT NULL,
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "tts_jobs_status_check" CHECK (("status" = ANY (ARRAY['queued'::"text", 'processing'::"text", 'done'::"text", 'error'::"text"]))),
    CONSTRAINT "tts_jobs_style_check" CHECK (("style" = ANY (ARRAY['normal'::"text", 'slow'::"text", 'teaching'::"text"])))
);


ALTER TABLE "public"."tts_jobs" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_onboarding_progress" WITH ("security_invoker"='true') AS
 WITH "p" AS (
         SELECT "profiles"."id" AS "user_id",
            NULLIF(TRIM(BOTH FROM "profiles"."full_name"), ''::"text") AS "full_name",
            NULLIF(TRIM(BOTH FROM "profiles"."mother_tongue"), ''::"text") AS "mother_tongue",
            "profiles"."other_languages",
            NULLIF(TRIM(BOTH FROM "profiles"."german_level"), ''::"text") AS "german_level",
            NULLIF(TRIM(BOTH FROM "profiles"."current_country"), ''::"text") AS "current_country",
            NULLIF(TRIM(BOTH FROM "profiles"."origin_country"), ''::"text") AS "origin_country",
            "profiles"."birthday",
            NULLIF(TRIM(BOTH FROM "profiles"."target"), ''::"text") AS "target",
            NULLIF(TRIM(BOTH FROM "profiles"."avatar_url"), ''::"text") AS "avatar_url"
           FROM "public"."profiles"
        ), "missing" AS (
         SELECT "p"."user_id",
            "array_remove"(ARRAY[
                CASE
                    WHEN ("p"."full_name" IS NULL) THEN 'full_name'::"text"
                    ELSE NULL::"text"
                END,
                CASE
                    WHEN ("p"."mother_tongue" IS NULL) THEN 'mother_tongue'::"text"
                    ELSE NULL::"text"
                END,
                CASE
                    WHEN ("p"."german_level" IS NULL) THEN 'german_level'::"text"
                    ELSE NULL::"text"
                END,
                CASE
                    WHEN ("p"."current_country" IS NULL) THEN 'current_country'::"text"
                    ELSE NULL::"text"
                END,
                CASE
                    WHEN ("p"."origin_country" IS NULL) THEN 'origin_country'::"text"
                    ELSE NULL::"text"
                END,
                CASE
                    WHEN ("p"."birthday" IS NULL) THEN 'birthday'::"text"
                    ELSE NULL::"text"
                END,
                CASE
                    WHEN ("p"."target" IS NULL) THEN 'target'::"text"
                    ELSE NULL::"text"
                END,
                CASE
                    WHEN ("p"."avatar_url" IS NULL) THEN 'avatar_url'::"text"
                    ELSE NULL::"text"
                END], NULL::"text") AS "missing_fields"
           FROM "p"
        )
 SELECT "user_id",
    (8 - COALESCE("array_length"("missing_fields", 1), 0)) AS "completed",
    8 AS "total",
    "missing_fields",
    (COALESCE("array_length"("missing_fields", 1), 0) = 0) AS "is_complete",
        CASE
            WHEN (COALESCE("array_length"("missing_fields", 1), 0) = 0) THEN 'done'::"text"
            WHEN ("missing_fields" && ARRAY['full_name'::"text", 'mother_tongue'::"text", 'other_languages'::"text", 'german_level'::"text"]) THEN 'basics'::"text"
            WHEN ("missing_fields" && ARRAY['current_country'::"text", 'origin_country'::"text", 'birthday'::"text"]) THEN 'background'::"text"
            WHEN ("missing_fields" && ARRAY['target'::"text", 'avatar_url'::"text"]) THEN 'goal'::"text"
            ELSE 'basics'::"text"
        END AS "next_step"
   FROM "missing" "m";


ALTER VIEW "public"."v_onboarding_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waitlist_signups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "country" "text",
    "target" "text",
    "german_level" "text",
    "start_timeframe" "text",
    "whatsapp" "text",
    "contacted" boolean DEFAULT false NOT NULL,
    "contacted_at" timestamp with time zone,
    "country_code" "text",
    "normalized_target" "text",
    "normalized_level" "text",
    "normalized_timeframe" "text",
    "priority" boolean DEFAULT false NOT NULL,
    "email_confirmed_at" timestamp with time zone,
    "followup_3d_sent_at" timestamp with time zone
);


ALTER TABLE "public"."waitlist_signups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_experience_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "company" "text" NOT NULL,
    "title" "text" NOT NULL,
    "start_date" "date",
    "end_date" "date",
    "is_current" boolean DEFAULT false NOT NULL,
    "location" "text",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."work_experience_entries" OWNER TO "postgres";


ALTER TABLE ONLY "public"."access_requests"
    ADD CONSTRAINT "access_requests_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."access_requests"
    ADD CONSTRAINT "access_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_audit_log"
    ADD CONSTRAINT "admin_audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."batch_members"
    ADD CONSTRAINT "batch_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."batches"
    ADD CONSTRAINT "batches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_attachments"
    ADD CONSTRAINT "chat_attachments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_threads"
    ADD CONSTRAINT "chat_threads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."drill_lines"
    ADD CONSTRAINT "drill_lines_drill_id_order_index_key" UNIQUE ("drill_id", "order_index");



ALTER TABLE ONLY "public"."drill_lines"
    ADD CONSTRAINT "drill_lines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."drills"
    ADD CONSTRAINT "drills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."drills"
    ADD CONSTRAINT "drills_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."education_entries"
    ADD CONSTRAINT "education_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employer_candidate_actions"
    ADD CONSTRAINT "employer_candidate_actions_employer_id_learner_id_action_key" UNIQUE ("employer_id", "learner_id", "action");



ALTER TABLE ONLY "public"."employer_candidate_actions"
    ADD CONSTRAINT "employer_candidate_actions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employer_leads"
    ADD CONSTRAINT "employer_leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."journey_events"
    ADD CONSTRAINT "journey_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mentor_messages"
    ADD CONSTRAINT "mentor_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mentor_threads"
    ADD CONSTRAINT "mentor_threads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."module_progress"
    ADD CONSTRAINT "module_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_languages"
    ADD CONSTRAINT "profile_languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_skills"
    ADD CONSTRAINT "profile_skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pronunciation_guides"
    ADD CONSTRAINT "pronunciation_guides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."readiness_events"
    ADD CONSTRAINT "readiness_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tts_audio_assets"
    ADD CONSTRAINT "tts_audio_assets_line_id_voice_provider_voice_id_style_ssml_key" UNIQUE ("line_id", "voice_provider", "voice_id", "style", "ssml_hash");



ALTER TABLE ONLY "public"."tts_audio_assets"
    ADD CONSTRAINT "tts_audio_assets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tts_jobs"
    ADD CONSTRAINT "tts_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waitlist_signups"
    ADD CONSTRAINT "waitlist_signups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."weekly_checkins"
    ADD CONSTRAINT "weekly_checkins_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."weekly_checkins"
    ADD CONSTRAINT "weekly_checkins_user_id_week_start_key" UNIQUE ("user_id", "week_start");



ALTER TABLE ONLY "public"."work_experience_entries"
    ADD CONSTRAINT "work_experience_entries_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "batch_members_unique" ON "public"."batch_members" USING "btree" ("batch_id", "user_id");



CREATE INDEX "chat_attachments_thread_id_idx" ON "public"."chat_attachments" USING "btree" ("thread_id", "created_at");



CREATE INDEX "documents_user_id_created_at_idx" ON "public"."documents" USING "btree" ("user_id", "created_at" DESC);



CREATE UNIQUE INDEX "documents_user_path_uidx" ON "public"."documents" USING "btree" ("user_id", "object_path");



CREATE INDEX "drill_lines_drill_id_idx" ON "public"."drill_lines" USING "btree" ("drill_id");



CREATE INDEX "drills_level_idx" ON "public"."drills" USING "btree" ("level");



CREATE INDEX "drills_topic_idx" ON "public"."drills" USING "btree" ("topic");



CREATE INDEX "education_entries_profile_id_idx" ON "public"."education_entries" USING "btree" ("profile_id");



CREATE INDEX "employer_leads_created_at_idx" ON "public"."employer_leads" USING "btree" ("created_at" DESC);



CREATE UNIQUE INDEX "employer_leads_email_unique" ON "public"."employer_leads" USING "btree" ("lower"("email"));



CREATE INDEX "mentor_messages_thread_created_idx" ON "public"."mentor_messages" USING "btree" ("thread_id", "created_at" DESC);



CREATE INDEX "mentor_messages_thread_id_idx" ON "public"."mentor_messages" USING "btree" ("thread_id", "created_at");



CREATE INDEX "mentor_messages_thread_idx" ON "public"."mentor_messages" USING "btree" ("thread_id", "created_at");



CREATE UNIQUE INDEX "module_progress_unique" ON "public"."module_progress" USING "btree" ("user_id", "module_id");



CREATE UNIQUE INDEX "profile_languages_one_german_per_profile" ON "public"."profile_languages" USING "btree" ("profile_id") WHERE ("kind" = 'german'::"text");



CREATE UNIQUE INDEX "profile_languages_one_mother_tongue_per_profile" ON "public"."profile_languages" USING "btree" ("profile_id") WHERE ("kind" = 'mother_tongue'::"text");



CREATE INDEX "profile_languages_profile_id_idx" ON "public"."profile_languages" USING "btree" ("profile_id");



CREATE INDEX "profile_skills_profile_id_idx" ON "public"."profile_skills" USING "btree" ("profile_id");



CREATE UNIQUE INDEX "profile_skills_unique_per_profile" ON "public"."profile_skills" USING "btree" ("profile_id", "lower"("skill"));



CREATE INDEX "profiles_updated_at_idx" ON "public"."profiles" USING "btree" ("updated_at");



CREATE INDEX "pronunciation_guides_line_id_idx" ON "public"."pronunciation_guides" USING "btree" ("line_id");



CREATE INDEX "pronunciation_guides_word_idx" ON "public"."pronunciation_guides" USING "btree" ("word");



CREATE INDEX "readiness_events_profile_id_idx" ON "public"."readiness_events" USING "btree" ("profile_id");



CREATE INDEX "tts_audio_assets_hash_idx" ON "public"."tts_audio_assets" USING "btree" ("ssml_hash");



CREATE INDEX "tts_audio_assets_line_id_idx" ON "public"."tts_audio_assets" USING "btree" ("line_id");



CREATE INDEX "tts_jobs_line_id_idx" ON "public"."tts_jobs" USING "btree" ("line_id");



CREATE INDEX "tts_jobs_status_idx" ON "public"."tts_jobs" USING "btree" ("status");



CREATE UNIQUE INDEX "waitlist_signups_email_unique" ON "public"."waitlist_signups" USING "btree" ("lower"("email"));



CREATE INDEX "weekly_checkins_user_week_idx" ON "public"."weekly_checkins" USING "btree" ("user_id", "week_start");



CREATE INDEX "work_entries_profile_id_idx" ON "public"."work_experience_entries" USING "btree" ("profile_id");



CREATE OR REPLACE TRIGGER "set_weekly_checkins_updated_at" BEFORE UPDATE ON "public"."weekly_checkins" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "tts_jobs_set_updated_at" BEFORE UPDATE ON "public"."tts_jobs" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."batch_members"
    ADD CONSTRAINT "batch_members_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."batch_members"
    ADD CONSTRAINT "batch_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_attachments"
    ADD CONSTRAINT "chat_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."mentor_messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_attachments"
    ADD CONSTRAINT "chat_attachments_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."mentor_threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_threads"
    ADD CONSTRAINT "chat_threads_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_threads"
    ADD CONSTRAINT "chat_threads_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."drill_lines"
    ADD CONSTRAINT "drill_lines_drill_id_fkey" FOREIGN KEY ("drill_id") REFERENCES "public"."drills"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."education_entries"
    ADD CONSTRAINT "education_entries_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."journey_events"
    ADD CONSTRAINT "journey_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mentor_messages"
    ADD CONSTRAINT "mentor_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mentor_messages"
    ADD CONSTRAINT "mentor_messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."mentor_threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mentor_threads"
    ADD CONSTRAINT "mentor_threads_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mentor_threads"
    ADD CONSTRAINT "mentor_threads_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."module_progress"
    ADD CONSTRAINT "module_progress_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."module_progress"
    ADD CONSTRAINT "module_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile_languages"
    ADD CONSTRAINT "profile_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile_skills"
    ADD CONSTRAINT "profile_skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pronunciation_guides"
    ADD CONSTRAINT "pronunciation_guides_line_id_fkey" FOREIGN KEY ("line_id") REFERENCES "public"."drill_lines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."readiness_events"
    ADD CONSTRAINT "readiness_events_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tts_audio_assets"
    ADD CONSTRAINT "tts_audio_assets_line_id_fkey" FOREIGN KEY ("line_id") REFERENCES "public"."drill_lines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tts_jobs"
    ADD CONSTRAINT "tts_jobs_line_id_fkey" FOREIGN KEY ("line_id") REFERENCES "public"."drill_lines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."weekly_checkins"
    ADD CONSTRAINT "weekly_checkins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_experience_entries"
    ADD CONSTRAINT "work_experience_entries_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE "public"."access_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "access_requests_insert_allow" ON "public"."access_requests" FOR INSERT TO "authenticated", "anon" WITH CHECK ((COALESCE("email", ''::"text") <> ''::"text"));



CREATE POLICY "access_requests_select_deny" ON "public"."access_requests" FOR SELECT TO "authenticated", "anon" USING (false);



CREATE POLICY "admin_audit_admin_only_insert" ON "public"."admin_audit_log" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text")))));



CREATE POLICY "admin_audit_admin_only_select" ON "public"."admin_audit_log" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text")))));



ALTER TABLE "public"."admin_audit_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."batch_members" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "batch_members_select_own" ON "public"."batch_members" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."batches" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "batches_select_member" ON "public"."batches" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."batch_members" "bm"
  WHERE (("bm"."batch_id" = "batches"."id") AND ("bm"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."chat_attachments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_threads" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "delete_own_education_entries" ON "public"."education_entries" FOR DELETE TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "delete_own_profile_languages" ON "public"."profile_languages" FOR DELETE TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "delete_own_profile_skills" ON "public"."profile_skills" FOR DELETE TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "delete_own_work_entries" ON "public"."work_experience_entries" FOR DELETE TO "authenticated" USING (("profile_id" = "auth"."uid"()));



ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "documents_delete_own" ON "public"."documents" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "documents_insert_own" ON "public"."documents" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "documents_select_own" ON "public"."documents" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "documents_update_own" ON "public"."documents" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."drill_lines" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "drill_lines_read" ON "public"."drill_lines" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."drills" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "drills_read" ON "public"."drills" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."education_entries" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "employer_actions_rw" ON "public"."employer_candidate_actions" TO "authenticated" USING (("employer_id" = "auth"."uid"())) WITH CHECK (("employer_id" = "auth"."uid"()));



ALTER TABLE "public"."employer_candidate_actions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."employer_leads" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "employer_leads_insert_allow" ON "public"."employer_leads" FOR INSERT TO "authenticated", "anon" WITH CHECK ((COALESCE("email", ''::"text") <> ''::"text"));



CREATE POLICY "employer_leads_select_deny" ON "public"."employer_leads" FOR SELECT TO "authenticated", "anon" USING (false);



CREATE POLICY "insert_own_education_entries" ON "public"."education_entries" FOR INSERT TO "authenticated" WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "insert_own_profile_languages" ON "public"."profile_languages" FOR INSERT TO "authenticated" WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "insert_own_profile_skills" ON "public"."profile_skills" FOR INSERT TO "authenticated" WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "insert_own_readiness_events" ON "public"."readiness_events" FOR INSERT TO "authenticated" WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "insert_own_work_entries" ON "public"."work_experience_entries" FOR INSERT TO "authenticated" WITH CHECK (("profile_id" = "auth"."uid"()));



ALTER TABLE "public"."journey_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "journey_events_insert_own" ON "public"."journey_events" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "journey_events_read_own" ON "public"."journey_events" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "journey_insert_own" ON "public"."journey_events" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "journey_select_own" ON "public"."journey_events" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."mentor_messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "mentor_messages_insert_thread_member" ON "public"."mentor_messages" FOR INSERT TO "authenticated" WITH CHECK ((("sender_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."mentor_threads" "t"
  WHERE (("t"."id" = "mentor_messages"."thread_id") AND (("t"."learner_id" = "auth"."uid"()) OR ("t"."mentor_id" = "auth"."uid"())))))));



CREATE POLICY "mentor_messages_select_thread_member" ON "public"."mentor_messages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."mentor_threads" "t"
  WHERE (("t"."id" = "mentor_messages"."thread_id") AND (("t"."learner_id" = "auth"."uid"()) OR ("t"."mentor_id" = "auth"."uid"()))))));



ALTER TABLE "public"."mentor_threads" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "mentor_threads_select_own" ON "public"."mentor_threads" FOR SELECT TO "authenticated" USING ((("learner_id" = "auth"."uid"()) OR ("mentor_id" = "auth"."uid"())));



CREATE POLICY "messages_insert_own" ON "public"."chat_messages" FOR INSERT TO "authenticated" WITH CHECK (("sender_id" = "auth"."uid"()));



CREATE POLICY "messages_insert_thread_participants" ON "public"."mentor_messages" FOR INSERT TO "authenticated" WITH CHECK ((("sender_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."mentor_threads" "t"
  WHERE (("t"."id" = "mentor_messages"."thread_id") AND (("t"."learner_id" = "auth"."uid"()) OR ("t"."mentor_id" = "auth"."uid"())))))));



CREATE POLICY "messages_select_thread" ON "public"."chat_messages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."chat_threads" "t"
  WHERE (("t"."id" = "chat_messages"."thread_id") AND (("t"."learner_id" = "auth"."uid"()) OR ("t"."mentor_id" = "auth"."uid"()))))));



CREATE POLICY "messages_select_thread_participants" ON "public"."mentor_messages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."mentor_threads" "t"
  WHERE (("t"."id" = "mentor_messages"."thread_id") AND (("t"."learner_id" = "auth"."uid"()) OR ("t"."mentor_id" = "auth"."uid"()))))));



ALTER TABLE "public"."module_progress" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "module_progress_read_own" ON "public"."module_progress" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "module_progress_select_own" ON "public"."module_progress" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "module_progress_update_own" ON "public"."module_progress" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "module_progress_upsert_own" ON "public"."module_progress" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."modules" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "modules_read" ON "public"."modules" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "modules_select_auth" ON "public"."modules" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "mp_insert_own" ON "public"."module_progress" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "mp_read_own" ON "public"."module_progress" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "mp_update_own" ON "public"."module_progress" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."profile_languages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_skills" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



ALTER TABLE "public"."pronunciation_guides" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "pronunciation_guides_read" ON "public"."pronunciation_guides" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "read_own_education_entries" ON "public"."education_entries" FOR SELECT TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "read_own_profile_languages" ON "public"."profile_languages" FOR SELECT TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "read_own_profile_skills" ON "public"."profile_skills" FOR SELECT TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "read_own_readiness_events" ON "public"."readiness_events" FOR SELECT TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "read_own_work_entries" ON "public"."work_experience_entries" FOR SELECT TO "authenticated" USING (("profile_id" = "auth"."uid"()));



ALTER TABLE "public"."readiness_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "threads_insert_learner" ON "public"."mentor_threads" FOR INSERT TO "authenticated" WITH CHECK (("learner_id" = "auth"."uid"()));



CREATE POLICY "threads_select_own" ON "public"."chat_threads" FOR SELECT TO "authenticated" USING ((("learner_id" = "auth"."uid"()) OR ("mentor_id" = "auth"."uid"())));



CREATE POLICY "threads_select_own" ON "public"."mentor_threads" FOR SELECT TO "authenticated" USING ((("learner_id" = "auth"."uid"()) OR ("mentor_id" = "auth"."uid"())));



ALTER TABLE "public"."tts_audio_assets" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "tts_audio_assets_read_public" ON "public"."tts_audio_assets" FOR SELECT USING (true);



ALTER TABLE "public"."tts_jobs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update_own_education_entries" ON "public"."education_entries" FOR UPDATE TO "authenticated" USING (("profile_id" = "auth"."uid"())) WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "update_own_profile_languages" ON "public"."profile_languages" FOR UPDATE TO "authenticated" USING (("profile_id" = "auth"."uid"())) WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "update_own_profile_skills" ON "public"."profile_skills" FOR UPDATE TO "authenticated" USING (("profile_id" = "auth"."uid"())) WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "update_own_work_entries" ON "public"."work_experience_entries" FOR UPDATE TO "authenticated" USING (("profile_id" = "auth"."uid"())) WITH CHECK (("profile_id" = "auth"."uid"()));



ALTER TABLE "public"."waitlist_signups" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "waitlist_signups_insert_allow" ON "public"."waitlist_signups" FOR INSERT TO "authenticated", "anon" WITH CHECK ((COALESCE("email", ''::"text") <> ''::"text"));



CREATE POLICY "waitlist_signups_select_deny" ON "public"."waitlist_signups" FOR SELECT TO "authenticated", "anon" USING (false);



CREATE POLICY "wc_insert_own" ON "public"."weekly_checkins" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "wc_read_own" ON "public"."weekly_checkins" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "wc_update_own" ON "public"."weekly_checkins" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."weekly_checkins" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_experience_entries" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."access_requests" TO "service_role";



GRANT ALL ON TABLE "public"."admin_audit_log" TO "anon";
GRANT ALL ON TABLE "public"."admin_audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_audit_log" TO "service_role";



GRANT ALL ON TABLE "public"."batch_members" TO "anon";
GRANT ALL ON TABLE "public"."batch_members" TO "authenticated";
GRANT ALL ON TABLE "public"."batch_members" TO "service_role";



GRANT ALL ON TABLE "public"."batches" TO "anon";
GRANT ALL ON TABLE "public"."batches" TO "authenticated";
GRANT ALL ON TABLE "public"."batches" TO "service_role";



GRANT ALL ON TABLE "public"."chat_attachments" TO "anon";
GRANT ALL ON TABLE "public"."chat_attachments" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_attachments" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."chat_threads" TO "anon";
GRANT ALL ON TABLE "public"."chat_threads" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_threads" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."drill_lines" TO "anon";
GRANT ALL ON TABLE "public"."drill_lines" TO "authenticated";
GRANT ALL ON TABLE "public"."drill_lines" TO "service_role";



GRANT ALL ON TABLE "public"."drills" TO "anon";
GRANT ALL ON TABLE "public"."drills" TO "authenticated";
GRANT ALL ON TABLE "public"."drills" TO "service_role";



GRANT ALL ON TABLE "public"."education_entries" TO "anon";
GRANT ALL ON TABLE "public"."education_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."education_entries" TO "service_role";



GRANT ALL ON TABLE "public"."employer_candidate_actions" TO "anon";
GRANT ALL ON TABLE "public"."employer_candidate_actions" TO "authenticated";
GRANT ALL ON TABLE "public"."employer_candidate_actions" TO "service_role";



GRANT ALL ON TABLE "public"."employer_leads" TO "service_role";



GRANT ALL ON TABLE "public"."module_progress" TO "anon";
GRANT ALL ON TABLE "public"."module_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."module_progress" TO "service_role";



GRANT ALL ON TABLE "public"."modules" TO "anon";
GRANT ALL ON TABLE "public"."modules" TO "authenticated";
GRANT ALL ON TABLE "public"."modules" TO "service_role";



GRANT ALL ON TABLE "public"."profile_languages" TO "anon";
GRANT ALL ON TABLE "public"."profile_languages" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_languages" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."weekly_checkins" TO "anon";
GRANT ALL ON TABLE "public"."weekly_checkins" TO "authenticated";
GRANT ALL ON TABLE "public"."weekly_checkins" TO "service_role";



GRANT ALL ON TABLE "public"."employer_readiness_view" TO "anon";
GRANT ALL ON TABLE "public"."employer_readiness_view" TO "authenticated";
GRANT ALL ON TABLE "public"."employer_readiness_view" TO "service_role";



GRANT ALL ON TABLE "public"."journey_events" TO "anon";
GRANT ALL ON TABLE "public"."journey_events" TO "authenticated";
GRANT ALL ON TABLE "public"."journey_events" TO "service_role";



GRANT ALL ON TABLE "public"."mentor_messages" TO "anon";
GRANT ALL ON TABLE "public"."mentor_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."mentor_messages" TO "service_role";



GRANT ALL ON TABLE "public"."mentor_threads" TO "anon";
GRANT ALL ON TABLE "public"."mentor_threads" TO "authenticated";
GRANT ALL ON TABLE "public"."mentor_threads" TO "service_role";



GRANT ALL ON TABLE "public"."profile_skills" TO "anon";
GRANT ALL ON TABLE "public"."profile_skills" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_skills" TO "service_role";



GRANT ALL ON TABLE "public"."pronunciation_guides" TO "anon";
GRANT ALL ON TABLE "public"."pronunciation_guides" TO "authenticated";
GRANT ALL ON TABLE "public"."pronunciation_guides" TO "service_role";



GRANT ALL ON TABLE "public"."readiness_events" TO "anon";
GRANT ALL ON TABLE "public"."readiness_events" TO "authenticated";
GRANT ALL ON TABLE "public"."readiness_events" TO "service_role";



GRANT ALL ON TABLE "public"."tts_audio_assets" TO "anon";
GRANT ALL ON TABLE "public"."tts_audio_assets" TO "authenticated";
GRANT ALL ON TABLE "public"."tts_audio_assets" TO "service_role";



GRANT ALL ON TABLE "public"."tts_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."v_onboarding_progress" TO "anon";
GRANT ALL ON TABLE "public"."v_onboarding_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."v_onboarding_progress" TO "service_role";



GRANT ALL ON TABLE "public"."waitlist_signups" TO "service_role";



GRANT ALL ON TABLE "public"."work_experience_entries" TO "anon";
GRANT ALL ON TABLE "public"."work_experience_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."work_experience_entries" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

drop policy "access_requests_insert_allow" on "public"."access_requests";

drop policy "access_requests_select_deny" on "public"."access_requests";

drop policy "drill_lines_read" on "public"."drill_lines";

drop policy "drills_read" on "public"."drills";

drop policy "employer_leads_insert_allow" on "public"."employer_leads";

drop policy "employer_leads_select_deny" on "public"."employer_leads";

drop policy "pronunciation_guides_read" on "public"."pronunciation_guides";

drop policy "waitlist_signups_insert_allow" on "public"."waitlist_signups";

drop policy "waitlist_signups_select_deny" on "public"."waitlist_signups";

revoke references on table "public"."access_requests" from "anon";

revoke trigger on table "public"."access_requests" from "anon";

revoke truncate on table "public"."access_requests" from "anon";

revoke references on table "public"."access_requests" from "authenticated";

revoke trigger on table "public"."access_requests" from "authenticated";

revoke truncate on table "public"."access_requests" from "authenticated";

revoke references on table "public"."employer_leads" from "anon";

revoke trigger on table "public"."employer_leads" from "anon";

revoke truncate on table "public"."employer_leads" from "anon";

revoke references on table "public"."employer_leads" from "authenticated";

revoke trigger on table "public"."employer_leads" from "authenticated";

revoke truncate on table "public"."employer_leads" from "authenticated";

revoke references on table "public"."tts_jobs" from "anon";

revoke trigger on table "public"."tts_jobs" from "anon";

revoke truncate on table "public"."tts_jobs" from "anon";

revoke references on table "public"."tts_jobs" from "authenticated";

revoke trigger on table "public"."tts_jobs" from "authenticated";

revoke truncate on table "public"."tts_jobs" from "authenticated";

revoke references on table "public"."waitlist_signups" from "anon";

revoke trigger on table "public"."waitlist_signups" from "anon";

revoke truncate on table "public"."waitlist_signups" from "anon";

revoke references on table "public"."waitlist_signups" from "authenticated";

revoke trigger on table "public"."waitlist_signups" from "authenticated";

revoke truncate on table "public"."waitlist_signups" from "authenticated";


  create policy "access_requests_insert_allow"
  on "public"."access_requests"
  as permissive
  for insert
  to anon, authenticated
with check ((COALESCE(email, ''::text) <> ''::text));



  create policy "access_requests_select_deny"
  on "public"."access_requests"
  as permissive
  for select
  to anon, authenticated
using (false);



  create policy "drill_lines_read"
  on "public"."drill_lines"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "drills_read"
  on "public"."drills"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "employer_leads_insert_allow"
  on "public"."employer_leads"
  as permissive
  for insert
  to anon, authenticated
with check ((COALESCE(email, ''::text) <> ''::text));



  create policy "employer_leads_select_deny"
  on "public"."employer_leads"
  as permissive
  for select
  to anon, authenticated
using (false);



  create policy "pronunciation_guides_read"
  on "public"."pronunciation_guides"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "waitlist_signups_insert_allow"
  on "public"."waitlist_signups"
  as permissive
  for insert
  to anon, authenticated
with check ((COALESCE(email, ''::text) <> ''::text));



  create policy "waitlist_signups_select_deny"
  on "public"."waitlist_signups"
  as permissive
  for select
  to anon, authenticated
using (false);


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "DELETE ph6blb_0"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'chat-media'::text) AND (name ~~ (('users/'::text || (auth.uid())::text) || '/%'::text))));



  create policy "READ 1fbf13d_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated, anon
using (((bucket_id = 'asr-audio'::text) AND (split_part(name, '/'::text, 1) = 'users'::text) AND (split_part(name, '/'::text, 2) = 'local-user'::text)));



  create policy "READ ph6blb_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'chat-media'::text) AND (name ~~ (('users/'::text || (auth.uid())::text) || '/%'::text))));



  create policy "UPDATE ph6blb_0"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'chat-media'::text) AND (name ~~ (('users/'::text || (auth.uid())::text) || '/%'::text))));



  create policy "UPLOAD 1fbf13d_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated, anon
with check (((bucket_id = 'asr-audio'::text) AND (split_part(name, '/'::text, 1) = 'users'::text) AND (split_part(name, '/'::text, 2) = 'local-user'::text)));



  create policy "UPLOAD ph6blb_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'chat-media'::text) AND (name ~~ (('users/'::text || (auth.uid())::text) || '/%'::text))));



  create policy "Users can delete own documents flreew_0"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users can delete own documents flreew_1"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Users can read own documents flreew_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users can update own documents flreew_0"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users can update own documents flreew_1"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users can upload own documents flreew_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "avatars_delete_own"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "avatars_insert_own"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "avatars_select_own"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "avatars_update_own"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "documents_storage_owner_delete"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'documents'::text) AND ((auth.uid())::text = split_part(name, '/'::text, 1))));



  create policy "documents_storage_owner_insert"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'documents'::text) AND ((auth.uid())::text = split_part(name, '/'::text, 1))));



  create policy "documents_storage_owner_select"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'documents'::text) AND ((auth.uid())::text = split_part(name, '/'::text, 1))));



  create policy "documents_storage_owner_update"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'documents'::text) AND ((auth.uid())::text = split_part(name, '/'::text, 1))))
with check (((bucket_id = 'documents'::text) AND ((auth.uid())::text = split_part(name, '/'::text, 1))));



