-- JobPath initial schema. Apply with `supabase db push` after linking a project.
create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 50),
  school_name text,
  graduation_year integer check (graduation_year between 2000 and 2100),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.companies (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0), industry text, company_type text, job_position text, location text, application_source text, job_url text, corporate_url text,
  interest_level integer check (interest_level between 1 and 5), current_status text not null default '興味あり' check (current_status in ('興味あり','応募予定','応募済み','説明会参加','書類選考','適性検査','一次面接','二次面接','最終面接','内定','不合格','辞退')),
  memo text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.selection_events (
  id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null, title text not null, event_date timestamptz not null, result text, memo text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.schedules (
  id uuid primary key default gen_random_uuid(), company_id uuid references public.companies(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, schedule_type text not null, start_at timestamptz not null, end_at timestamptz, is_deadline boolean not null default false, is_completed boolean not null default false, memo text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (end_at is null or end_at > start_at)
);
create table public.interview_records (
  id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
  interview_round text, interview_date timestamptz, expected_questions text, prepared_answers text, reverse_questions text, actual_questions text, actual_answers text, good_points text, improvement_points text, interviewer_impression text, result text, memo text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.company_research (
  id uuid primary key default gen_random_uuid(), company_id uuid not null unique references public.companies(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
  company_features text, main_business text, strengths text, weaknesses text, motivation text, what_to_do_after_joining text, reverse_question_candidates text, concerns text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create index companies_user_updated_idx on public.companies(user_id, updated_at desc);
create index schedules_user_start_idx on public.schedules(user_id, start_at);
create index selection_events_company_date_idx on public.selection_events(company_id, event_date);

-- The composite references prevent attaching a user's event to another user's company.
alter table public.companies add constraint companies_id_user_unique unique (id, user_id);
alter table public.selection_events add constraint selection_events_owned_company_fk foreign key (company_id, user_id) references public.companies(id, user_id) on delete cascade;
alter table public.schedules add constraint schedules_owned_company_fk foreign key (company_id, user_id) references public.companies(id, user_id) on delete cascade;
alter table public.interview_records add constraint interview_records_owned_company_fk foreign key (company_id, user_id) references public.companies(id, user_id) on delete cascade;
alter table public.company_research add constraint company_research_owned_company_fk foreign key (company_id, user_id) references public.companies(id, user_id) on delete cascade;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
create or replace function public.create_profile_for_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, display_name) values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'ユーザー')); return new; end; $$;
revoke execute on function public.create_profile_for_new_user() from public;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_profile_for_new_user();
create trigger profiles_updated before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger companies_updated before update on public.companies for each row execute procedure public.set_updated_at();
create trigger selection_events_updated before update on public.selection_events for each row execute procedure public.set_updated_at();
create trigger schedules_updated before update on public.schedules for each row execute procedure public.set_updated_at();
create trigger interview_records_updated before update on public.interview_records for each row execute procedure public.set_updated_at();
create trigger company_research_updated before update on public.company_research for each row execute procedure public.set_updated_at();

-- Limits are enforced in the database as well as in the UI.
create or replace function public.enforce_jobpath_limits() returns trigger language plpgsql set search_path = public as $$ declare max_count integer; current_count integer; begin
  if tg_table_name = 'companies' then max_count := 100; elsif tg_table_name in ('selection_events','schedules') then max_count := 30; else max_count := 10; end if;
  if tg_table_name = 'companies' then select count(*) into current_count from public.companies where user_id = new.user_id;
  elsif tg_table_name = 'selection_events' then select count(*) into current_count from public.selection_events where company_id = new.company_id;
  elsif tg_table_name = 'schedules' then select count(*) into current_count from public.schedules where company_id = new.company_id;
  else select count(*) into current_count from public.interview_records where company_id = new.company_id; end if;
  if current_count >= max_count then raise exception using errcode = 'P0001', message = case when tg_table_name = 'companies' then '登録できる企業は最大100社です。' when tg_table_name = 'interview_records' then '面接記録は1社につき最大10件です。' else '1社につき登録できる件数は最大30件です。' end; end if; return new; end; $$;
create trigger companies_limit before insert on public.companies for each row execute procedure public.enforce_jobpath_limits();
create trigger selection_events_limit before insert on public.selection_events for each row execute procedure public.enforce_jobpath_limits();
create trigger schedules_limit before insert on public.schedules for each row when (new.company_id is not null) execute procedure public.enforce_jobpath_limits();
create trigger interview_records_limit before insert on public.interview_records for each row execute procedure public.enforce_jobpath_limits();

alter table public.profiles enable row level security; alter table public.companies enable row level security; alter table public.selection_events enable row level security; alter table public.schedules enable row level security; alter table public.interview_records enable row level security; alter table public.company_research enable row level security;
create policy "profiles: own rows" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "companies: own rows" on public.companies for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "selection events: own rows" on public.selection_events for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "schedules: own rows" on public.schedules for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "interviews: own rows" on public.interview_records for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "research: own rows" on public.company_research for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant usage on schema public to authenticated; grant select, insert, update, delete on all tables in schema public to authenticated;
