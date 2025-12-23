alter table public.profiles
  add column if not exists role text not null default 'learner'
    check (role in ('learner','employer','admin'));

drop trigger if exists handle_new_user on auth.users;
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'learner')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();
