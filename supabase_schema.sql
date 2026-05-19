-- ============================================================
-- 담덕법률사무소 사기 사건 정보 사이트 — Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에서 실행하세요
-- ============================================================

-- 1. fraud_cases 테이블 생성
create table if not exists public.fraud_cases (
  id            bigserial primary key,
  slug          text not null unique,
  title         text not null,
  body          text not null default '',
  meta_title    text not null default '',
  meta_description text not null default '',
  keywords      text[] not null default '{}',
  thumbnail_url text,
  image_urls    text[] not null default '{}',
  view_count    bigint not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2. updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_fraud_cases_updated_at on public.fraud_cases;
create trigger trg_fraud_cases_updated_at
  before update on public.fraud_cases
  for each row execute function public.set_updated_at();

-- 3. 조회수 증가 RPC (선택 사항)
create or replace function public.increment_view_count(p_slug text)
returns void language sql as $$
  update public.fraud_cases set view_count = view_count + 1 where slug = p_slug;
$$;

-- 4. 검색용 인덱스
create index if not exists idx_fraud_cases_slug on public.fraud_cases(slug);
create index if not exists idx_fraud_cases_created_at on public.fraud_cases(created_at desc);

-- 5. Row Level Security — 읽기는 전체 공개, 쓰기는 service_role만
alter table public.fraud_cases enable row level security;

drop policy if exists "public read" on public.fraud_cases;
create policy "public read"
  on public.fraud_cases for select
  using (true);

drop policy if exists "service write" on public.fraud_cases;
create policy "service write"
  on public.fraud_cases for all
  using (auth.role() = 'service_role');

-- ============================================================
-- Storage 설정 (대시보드 GUI로 하는 게 더 편합니다)
-- Storage > New bucket > 이름: fraud-images > Public 체크
-- ============================================================
