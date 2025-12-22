-- Ensure employer access requests capture company/contact metadata.
alter table public.access_requests
  add column if not exists company_name text,
  add column if not exists contact_name text,
  add column if not exists phone text,
  add column if not exists notes text;

-- Ensure email remains unique so upserts work as expected.
create unique index if not exists access_requests_email_unique
  on public.access_requests (email);
