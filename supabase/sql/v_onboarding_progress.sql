create or replace view public.v_onboarding_progress as
with normalized as (
  select
    p.id as user_id,
    nullif(trim(p.full_name), '') as full_name,
    nullif(trim(p.mother_tongue), '') as mother_tongue,
    nullif(trim(p.other_languages), '') as other_languages,
    nullif(trim(p.german_level), '') as german_level,
    nullif(trim(p.current_country), '') as current_country,
    nullif(trim(p.origin_country), '') as origin_country,
    nullif(trim(p.birthday::text), '') as birthday,
    nullif(trim(p.target), '') as target,
    nullif(trim(p.avatar_url), '') as avatar_url
  from public.profiles p
),
calc as (
  select
    user_id,
    (
      (case when full_name is not null then 1 else 0 end) +
      (case when german_level is not null then 1 else 0 end) +
      (case when current_country is not null then 1 else 0 end) +
      (case when origin_country is not null then 1 else 0 end) +
      (case when birthday is not null then 1 else 0 end) +
      (case when target is not null then 1 else 0 end)
    ) as completed_required,
    6 as total_required,
    array_remove(array[
      case when full_name is null then 'full_name' end,
      case when mother_tongue is null then 'mother_tongue' end,
      case when other_languages is null then 'other_languages' end,
      case when german_level is null then 'german_level' end,
      case when current_country is null then 'current_country' end,
      case when origin_country is null then 'origin_country' end,
      case when birthday is null then 'birthday' end,
      case when target is null then 'target' end,
      case when avatar_url is null then 'avatar_url' end
    ], null) as missing_fields
  from normalized
)
select
  user_id,
  completed_required as completed,
  total_required as total,
  missing_fields,
  case
    when completed_required >= total_required then 'done'
    when missing_fields && array['full_name', 'german_level']::text[] then 'basics'
    when missing_fields && array['current_country', 'origin_country', 'birthday']::text[] then 'background'
    else 'goal'
  end as next_step,
  completed_required >= total_required as is_complete
from calc;
