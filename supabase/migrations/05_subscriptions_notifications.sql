-- =====================================================================
-- MIGRATION: subscriptions + notifications
-- =====================================================================
-- Donors subscribe to a center by email. Center managers will be able
-- to send manual notifications to verified subscribers in a later step.
-- =====================================================================

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  email text not null,
  verification_token uuid not null default gen_random_uuid() unique,
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  verified_at timestamptz,
  unsubscribed_at timestamptz,
  last_email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists subscriptions_center_email_idx
  on public.subscriptions (center_id, lower(email));

create index if not exists subscriptions_active_idx
  on public.subscriptions (center_id)
  where verified_at is not null and unsubscribed_at is null;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  sent_by uuid references auth.users(id) on delete set null,
  subject text not null,
  body text not null,
  recipients_count int not null default 0,
  sent_at timestamptz not null default now()
);

create index if not exists notifications_center_sent_idx
  on public.notifications (center_id, sent_at desc);

alter table public.subscriptions enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "subscriptions_insert_anyone"
  on public.subscriptions;
create policy "subscriptions_insert_anyone"
  on public.subscriptions
  for insert
  with check (true);

drop policy if exists "subscriptions_select_manager"
  on public.subscriptions;
create policy "subscriptions_select_manager"
  on public.subscriptions
  for select
  using (
    exists (
      select 1
      from public.centers c
      where c.id = subscriptions.center_id
        and c.manager_user_id = auth.uid()
    )
  );

drop policy if exists "notifications_select_manager"
  on public.notifications;
create policy "notifications_select_manager"
  on public.notifications
  for select
  using (
    exists (
      select 1
      from public.centers c
      where c.id = notifications.center_id
        and c.manager_user_id = auth.uid()
    )
  );

grant insert on public.subscriptions to anon, authenticated;
grant select on public.subscriptions to authenticated;
grant select on public.notifications to authenticated;

create or replace function public.center_subscriber_count(p_center_id uuid)
returns int
language sql
stable
security invoker
as $$
  select count(*)::int
  from public.subscriptions
  where center_id = p_center_id
    and verified_at is not null
    and unsubscribed_at is null;
$$;

grant execute on function public.center_subscriber_count(uuid)
  to anon, authenticated;
