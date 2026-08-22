-- Appointment services shown on /appointment
-- Run this in the Supabase SQL Editor.

create table if not exists public.appointment_services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  flag_image text not null,
  description text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointment_services_published_sort_idx
  on public.appointment_services (is_published, sort_order, name);

create or replace function public.set_appointment_services_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists appointment_services_set_updated_at
  on public.appointment_services;

create trigger appointment_services_set_updated_at
before update on public.appointment_services
for each row
execute function public.set_appointment_services_updated_at();

alter table public.appointment_services enable row level security;

drop policy if exists "Public can read published appointment services"
  on public.appointment_services;
create policy "Public can read published appointment services"
  on public.appointment_services
  for select
  to anon, authenticated
  using (is_published = true or public.is_admin());

drop policy if exists "Admins can insert appointment services"
  on public.appointment_services;
create policy "Admins can insert appointment services"
  on public.appointment_services
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update appointment services"
  on public.appointment_services;
create policy "Admins can update appointment services"
  on public.appointment_services
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete appointment services"
  on public.appointment_services;
create policy "Admins can delete appointment services"
  on public.appointment_services
  for delete
  to authenticated
  using (public.is_admin());

-- Seed the current hard-coded offices (skip if rows already exist).
insert into public.appointment_services (name, flag_image, description, sort_order, is_published)
select *
from (
  values
    (
      'Portugal Visa Appointment Office',
      '/images/portugal.webp',
      'We provide professional visa appointment assistance for the following offices.',
      10,
      true
    ),
    (
      'Pakistan Visa Appointment Office',
      '/images/pakistan.svg',
      'We help clients book visa appointments with accurate information and professional support.',
      20,
      true
    ),
    (
      'Germany Visa Appointment Office',
      '/images/germany.webp',
      'We provide professional visa appointment assistance with accurate information and reliable support.',
      30,
      true
    ),
    (
      'Sweden Appointment Office',
      '/images/sweden.webp',
      'Get professional assistance for your visa appointment booking and application process.',
      40,
      true
    )
) as seed(name, flag_image, description, sort_order, is_published)
where not exists (select 1 from public.appointment_services limit 1);
