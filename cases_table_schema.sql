-- ============================================================
-- 사이트2 (damdeoc-lawoffice.kr) 전용 테이블 분리
-- Supabase 대시보드 > SQL Editor 에서 이 전체를 붙여넣고 실행하세요.
-- 실행 후 노모스에게 "cases 테이블 만들었어" 라고 알려주시면
-- 코드 분리 → 전체 발행 → GSC 등록까지 자동으로 진행합니다.
-- ============================================================

-- 1. cases 테이블 생성 (fraud_cases 와 동일 구조)
create table if not exists public.cases (
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

drop trigger if exists trg_cases_updated_at on public.cases;
create trigger trg_cases_updated_at
  before update on public.cases
  for each row execute function public.set_updated_at();

-- 3. 조회수 증가 RPC (사이트2 전용 — 함수명 충돌 방지)
create or replace function public.increment_view_count_cases(p_slug text)
returns void language sql as $$
  update public.cases set view_count = view_count + 1 where slug = p_slug;
$$;

-- 4. 검색용 인덱스
create index if not exists idx_cases_slug on public.cases(slug);
create index if not exists idx_cases_created_at on public.cases(created_at desc);

-- 5. Row Level Security — 읽기 공개, 쓰기 service_role만
alter table public.cases enable row level security;

drop policy if exists "public read cases" on public.cases;
create policy "public read cases"
  on public.cases for select using (true);

drop policy if exists "service write cases" on public.cases;
create policy "service write cases"
  on public.cases for all using (auth.role() = 'service_role');
