-- No raw message storage; only minimal rule-based results.
create table if not exists public.scan_results (id uuid primary key, level text not null check(level in ('high','caution','unknown')), reason_codes text[] not null default '{}', rule_version text not null, created_at timestamptz not null default now());
alter table public.scan_results enable row level security;
revoke all on public.scan_results from anon, authenticated;
create index if not exists scan_results_created_at_idx on public.scan_results(created_at desc);
