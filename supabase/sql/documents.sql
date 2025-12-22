create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  path text not null,
  filename text not null,
  mime_type text,
  size bigint,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'documents'
      and policyname = 'documents_select_own'
  ) then
    create policy documents_select_own on public.documents
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'documents'
      and policyname = 'documents_insert_own'
  ) then
    create policy documents_insert_own on public.documents
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'documents'
      and policyname = 'documents_update_own'
  ) then
    create policy documents_update_own on public.documents
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'documents'
      and policyname = 'documents_delete_own'
  ) then
    create policy documents_delete_own on public.documents
      for delete using (auth.uid() = user_id);
  end if;
end$$;
