create table if not exists public.employer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  website text,
  industry text,
  company_size text,
  hq_country text,
  contact_name text,
  contact_email text,
  phone text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger employer_profiles_updated_at
before update on public.employer_profiles
for each row execute procedure public.set_updated_at();

alter table public.employer_profiles enable row level security;

create policy "employer profile owner" on public.employer_profiles
  for select using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "employer profile admin"
  on public.employer_profiles
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
