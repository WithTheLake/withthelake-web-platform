-- ============================================
-- WithTheLake Database Schema
-- Supabase PostgreSQL Schema for Healing Road ON
--
-- 이 파일은 새 Supabase 프로젝트에서 바로 실행 가능합니다.
-- Supabase Dashboard > SQL Editor에 붙여넣고 Run 하세요.
-- 이미 테이블이 존재하는 경우에도 안전하게 재실행됩니다.
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 0. 공통 함수 (Trigger용)
-- ============================================

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 관리자 체크 함수 (SECURITY DEFINER = RLS 우회)
-- user_profiles 테이블의 RLS 정책에서 자기참조 순환 참조를 방지하기 위해 사용
-- SECURITY DEFINER 함수는 함수 소유자(postgres)의 권한으로 실행되어 RLS를 우회함
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM user_profiles WHERE user_id = auth.uid()),
    FALSE
  );
$$;

-- ============================================
-- 1. audio_tracks 테이블 (오디오 트랙 정보)
-- ============================================
CREATE TABLE IF NOT EXISTS audio_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 동적 카테고리 (audio_categories.slug 참조)
  subcategory VARCHAR(100), -- 세분류 (예: '자기수용', '성장', '자신감' 등)
  province VARCHAR(50), -- 도 (trail_guide용, 예: 'gangwon')
  city VARCHAR(50), -- 시군구 (trail_guide용, 예: 'chuncheon')
  trail_name VARCHAR(200), -- 길 이름 (trail_guide용, 예: '소양강 맨발 산책로')
  filename VARCHAR(255) NOT NULL,
  emoji VARCHAR(10),
  duration INTEGER, -- 재생 시간 (초)
  distance VARCHAR(20), -- 거리 (trail_guide용, 예: '2.5km')
  walking_time VARCHAR(50), -- 소요시간 (trail_guide용, 예: '약 40분')
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'moderate', 'hard')), -- 난이도
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audio_tracks_category ON audio_tracks(category);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_subcategory ON audio_tracks(subcategory);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_province ON audio_tracks(province);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_city ON audio_tracks(city);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_active ON audio_tracks(is_active);

COMMENT ON TABLE audio_tracks IS '오디오 트랙 정보 (걷기 안내, 긍정확언, 길 안내)';

-- ============================================
-- 2. user_profiles 테이블 (사용자 프로필)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nickname VARCHAR(50),
  avatar_url TEXT, -- 카카오 프로필 이미지 URL
  email TEXT, -- 카카오 계정 이메일 (OAuth 콜백에서 저장)
  gender VARCHAR(10), -- '남성', '여성' (설정 페이지에서 선택)
  age_group VARCHAR(20), -- '50대', '60대', '70대 이상' 등 (설정 페이지에서 선택)
  is_admin BOOLEAN DEFAULT FALSE, -- 관리자 여부
  is_blocked BOOLEAN DEFAULT FALSE, -- 차단 여부 (차단 시 글쓰기/댓글 제한)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin ON user_profiles(is_admin);

COMMENT ON TABLE user_profiles IS '사용자 프로필 (카카오 OAuth)';

-- ============================================
-- 3. emotion_records 테이블 (감정 기록 - EAMRA 프레임워크)
-- ============================================
-- E: Emotion (감정), M: Meaning (의미), A: Action (행동), R: Reflect (성찰), A: Anchor (고정)
CREATE TABLE IF NOT EXISTS emotion_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL 허용 (비로그인 사용자)
  session_id VARCHAR(100), -- 비로그인 사용자 식별용

  -- E. Emotion: 걷기 전 가장 크게 느꼈던 감정
  emotion_type VARCHAR(50) NOT NULL, -- 'joy', 'calm', 'gratitude', 'neutral', 'bored', 'tired', 'anxious', 'sad', 'angry'

  -- M. Meaning: 왜 그런 감정을 느꼈는지
  emotion_reason TEXT,

  -- A. Action: 도움이 된 행동들 (복수 선택)
  helpful_actions TEXT[], -- ['walking', 'barefoot_walking', 'affirmation', 'deep_breathing', ...]

  -- R. Reflect: 행동 후 느껴진 긍정적 변화 (복수 선택)
  positive_changes TEXT[], -- ['lighter', 'calm', 'happy', 'comfortable', ...]

  -- A. Anchor: 나를 위한 한마디
  self_message TEXT,

  -- 체험 장소 (선택)
  experience_location VARCHAR(100),

  -- 기존 필드 (하위 호환성)
  note TEXT, -- 기존 메모 필드 유지 (마이그레이션 호환)

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emotion_records_user_id ON emotion_records(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_records_session_id ON emotion_records(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_records_created_at ON emotion_records(created_at DESC);

COMMENT ON TABLE emotion_records IS '감정 기록 (비로그인 사용자 포함, EAMRA 프레임워크)';

-- ============================================
-- 4. emotion_reports 테이블 (주간 감정 보고서)
-- ============================================
CREATE TABLE IF NOT EXISTS emotion_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL, -- 주간 시작일 (월요일)
  week_end DATE NOT NULL, -- 주간 종료일 (일요일)
  total_records INTEGER DEFAULT 0, -- 해당 주 총 기록 수
  positive_ratio INTEGER DEFAULT 0, -- 긍정적 감정 비율 (%)
  emotion_summary JSONB, -- 감정별 통계
  top_helpful_actions TEXT[], -- 도움이 된 행동 TOP 3
  top_positive_changes TEXT[], -- 긍정적 변화 TOP 3
  ai_insight TEXT, -- AI 생성 인사이트
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emotion_reports_user_id ON emotion_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_reports_week_start ON emotion_reports(week_start DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_emotion_reports_user_week ON emotion_reports(user_id, week_start);

COMMENT ON TABLE emotion_reports IS '주간 감정 보고서 (AI 인사이트 포함)';

-- ============================================
-- 5. news_articles 테이블 (뉴스/언론 보도)
-- ============================================
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  source VARCHAR(100) NOT NULL, -- 언론사명
  category VARCHAR(50) NOT NULL CHECK (category IN ('언론보도', '해외자료', '블로그', '보도자료')),
  link TEXT NOT NULL, -- 기사 원문 링크
  thumbnail_url TEXT, -- 썸네일 이미지 URL
  published_at DATE NOT NULL, -- 기사 발행일
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_active ON news_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_news_articles_order_index ON news_articles(order_index);

COMMENT ON TABLE news_articles IS '뉴스/언론 보도 (관리자만 작성 가능)';

-- ============================================
-- 6. store_products 테이블 (스토어 상품)
-- ※ community_posts보다 먼저 생성 (FK 참조 대상)
-- ============================================
CREATE TABLE IF NOT EXISTS store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  price INTEGER NOT NULL, -- 판매가 (원)
  original_price INTEGER, -- 정가 (할인 전, NULL이면 할인 없음)
  category VARCHAR(50) NOT NULL,
  badge VARCHAR(20), -- 뱃지 (베스트, 인기, 추천, 신상품)
  rating DECIMAL(2,1) DEFAULT 0.0, -- 평점 (0.0 ~ 5.0)
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  naver_product_url TEXT, -- 네이버 스마트스토어 상품 링크
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_products_category ON store_products(category);
CREATE INDEX IF NOT EXISTS idx_store_products_is_active ON store_products(is_active);
CREATE INDEX IF NOT EXISTS idx_store_products_order_index ON store_products(order_index);

COMMENT ON TABLE store_products IS '스토어 상품 (관리자만 작성 가능)';

-- ============================================
-- 7. community_posts 테이블 (커뮤니티 게시판)
-- ※ store_products 이후 생성 (product_id FK)
-- ============================================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  board_type VARCHAR(20) NOT NULL CHECK (board_type IN ('notice', 'event', 'free', 'review')),
  topic VARCHAR(20), -- 말머리 (자유게시판용: 잡담, 질문, 정보, 후기)
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  images TEXT[], -- 이미지 URL 배열
  author_nickname VARCHAR(50),
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE, -- 상단 고정
  is_active BOOLEAN DEFAULT TRUE, -- soft delete
  -- 후기 게시판 전용
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5 AND (rating * 2) = FLOOR(rating * 2)),
  product_id UUID REFERENCES store_products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_board_type ON community_posts(board_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_active ON community_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_pinned ON community_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_community_posts_product_id ON community_posts(product_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_rating ON community_posts(rating);

COMMENT ON TABLE community_posts IS '커뮤니티 게시판 글 (공지사항, 자유게시판, 이벤트, 힐링 후기)';

-- ============================================
-- 8. community_comments 테이블 (댓글)
-- ============================================
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  author_nickname VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);

COMMENT ON TABLE community_comments IS '커뮤니티 게시판 댓글';

-- ============================================
-- 9. audio_categories 테이블 (오디오 카테고리)
-- ============================================
CREATE TABLE IF NOT EXISTS audio_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL, -- Storage 폴더명과 매칭 (예: walk_guide)
  label VARCHAR(100) NOT NULL, -- 한국어 표시명 (예: 걷기 안내)
  color VARCHAR(20) DEFAULT 'gray', -- 뱃지 색상 테마
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE audio_categories IS '오디오 카테고리 (동적 관리)';

-- ============================================
-- 10. store_categories 테이블 (스토어 카테고리)
-- ============================================
CREATE TABLE IF NOT EXISTS store_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE store_categories IS '스토어 카테고리 (동적 관리)';

-- ============================================
-- Row Level Security (RLS) 정책
-- ============================================

-- ---------- audio_tracks ----------
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audio_tracks' AND policyname = 'Anyone can read active audio tracks') THEN
    CREATE POLICY "Anyone can read active audio tracks"
      ON audio_tracks FOR SELECT
      USING (is_active = TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audio_tracks' AND policyname = 'Admins can manage audio tracks') THEN
    CREATE POLICY "Admins can manage audio tracks"
      ON audio_tracks FOR ALL
      USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      );
  END IF;
END $$;

-- ---------- user_profiles ----------
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can read own profile') THEN
    CREATE POLICY "Users can read own profile"
      ON user_profiles FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile"
      ON user_profiles FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- 관리자 정책: public.is_admin() 함수 사용 (자기참조 순환 참조 방지)
  -- ※ EXISTS (SELECT 1 FROM user_profiles WHERE ...) 패턴은 user_profiles 테이블에서
  --   무한 재귀를 발생시키므로 SECURITY DEFINER 함수를 사용해야 함
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Admins can read all profiles') THEN
    CREATE POLICY "Admins can read all profiles"
      ON user_profiles FOR SELECT
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Admins can update all profiles') THEN
    CREATE POLICY "Admins can update all profiles"
      ON user_profiles FOR UPDATE
      USING (public.is_admin());
  END IF;
END $$;

-- ---------- emotion_records ----------
ALTER TABLE emotion_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emotion_records' AND policyname = 'Users can read own emotion records') THEN
    CREATE POLICY "Users can read own emotion records"
      ON emotion_records FOR SELECT
      USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emotion_records' AND policyname = 'Anyone can insert emotion records') THEN
    CREATE POLICY "Anyone can insert emotion records"
      ON emotion_records FOR INSERT
      WITH CHECK (TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emotion_records' AND policyname = 'Users can update own emotion records') THEN
    CREATE POLICY "Users can update own emotion records"
      ON emotion_records FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- ---------- emotion_reports ----------
ALTER TABLE emotion_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emotion_reports' AND policyname = 'Users can read own reports') THEN
    CREATE POLICY "Users can read own reports"
      ON emotion_reports FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emotion_reports' AND policyname = 'Users can insert own reports') THEN
    CREATE POLICY "Users can insert own reports"
      ON emotion_reports FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emotion_reports' AND policyname = 'Users can delete own reports') THEN
    CREATE POLICY "Users can delete own reports"
      ON emotion_reports FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- ---------- news_articles ----------
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_articles' AND policyname = 'Anyone can read active news') THEN
    CREATE POLICY "Anyone can read active news"
      ON news_articles FOR SELECT
      USING (is_active = TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_articles' AND policyname = 'Admins can manage news articles') THEN
    CREATE POLICY "Admins can manage news articles"
      ON news_articles FOR ALL
      USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      );
  END IF;
END $$;

-- ---------- store_products ----------
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'store_products' AND policyname = 'Anyone can read active products') THEN
    CREATE POLICY "Anyone can read active products"
      ON store_products FOR SELECT
      USING (is_active = TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'store_products' AND policyname = 'Anyone can read store products') THEN
    CREATE POLICY "Anyone can read store products"
      ON store_products FOR SELECT
      USING (true);
  END IF;
END $$;

-- ---------- community_posts ----------
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Anyone can read active posts') THEN
    CREATE POLICY "Anyone can read active posts"
      ON community_posts FOR SELECT
      USING (is_active = TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Authenticated users can insert posts') THEN
    CREATE POLICY "Authenticated users can insert posts"
      ON community_posts FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Users can update own posts') THEN
    CREATE POLICY "Users can update own posts"
      ON community_posts FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;


  -- 관리자: 타인의 게시글 고정/숨김/삭제 가능
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Admins can update pin and active status') THEN
    CREATE POLICY "Admins can update pin and active status"
      ON community_posts FOR UPDATE
      USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      );
  END IF;
END $$;
-- 삭제는 soft delete (is_active = false)로 UPDATE 정책에 포함됨

-- ---------- community_comments ----------
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_comments' AND policyname = 'Anyone can read active comments') THEN
    CREATE POLICY "Anyone can read active comments"
      ON community_comments FOR SELECT
      USING (is_active = TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_comments' AND policyname = 'Authenticated users can insert comments') THEN
    CREATE POLICY "Authenticated users can insert comments"
      ON community_comments FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_comments' AND policyname = 'Users can update own comments') THEN
    CREATE POLICY "Users can update own comments"
      ON community_comments FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- 관리자: 타인의 댓글 숨김/삭제 가능
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_comments' AND policyname = 'Admins can update comment active status') THEN
    CREATE POLICY "Admins can update comment active status"
      ON community_comments FOR UPDATE
      USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      );
  END IF;
END $$;
-- 삭제는 soft delete (is_active = false)로 UPDATE 정책에 포함됨

-- ---------- audio_categories ----------
ALTER TABLE audio_categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audio_categories' AND policyname = 'Anyone can read audio categories') THEN
    CREATE POLICY "Anyone can read audio categories"
      ON audio_categories FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audio_categories' AND policyname = 'Admins can manage audio categories') THEN
    CREATE POLICY "Admins can manage audio categories"
      ON audio_categories FOR ALL
      USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      );
  END IF;
END $$;

-- ---------- store_categories ----------
ALTER TABLE store_categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'store_categories' AND policyname = 'Anyone can read store categories') THEN
    CREATE POLICY "Anyone can read store categories"
      ON store_categories FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'store_categories' AND policyname = 'Admins can manage store categories') THEN
    CREATE POLICY "Admins can manage store categories"
      ON store_categories FOR ALL
      USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
      );
  END IF;
END $$;

-- ============================================
-- Triggers (updated_at 자동 갱신)
-- ============================================

DROP TRIGGER IF EXISTS update_audio_tracks_updated_at ON audio_tracks;
CREATE TRIGGER update_audio_tracks_updated_at
  BEFORE UPDATE ON audio_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_comments_updated_at ON community_comments;
CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_store_products_updated_at ON store_products;
CREATE TRIGGER update_store_products_updated_at
  BEFORE UPDATE ON store_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RPC 함수
-- ============================================

-- 댓글 수 증가
CREATE OR REPLACE FUNCTION increment_comment_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET comment_count = comment_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 댓글 수 감소
CREATE OR REPLACE FUNCTION decrement_comment_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET comment_count = GREATEST(comment_count - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 상품 평균 평점/리뷰수 재계산
CREATE OR REPLACE FUNCTION update_product_rating(p_product_id UUID)
RETURNS VOID AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  total_reviews INTEGER;
BEGIN
  SELECT
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0),
    COUNT(*)
  INTO avg_rating, total_reviews
  FROM community_posts
  WHERE product_id = p_product_id
    AND board_type = 'review'
    AND is_active = TRUE
    AND rating IS NOT NULL;

  UPDATE store_products
  SET
    rating = avg_rating,
    review_count = total_reviews,
    updated_at = NOW()
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- 모든 상품 평점 일괄 업데이트
CREATE OR REPLACE FUNCTION update_all_product_ratings()
RETURNS VOID AS $$
DECLARE
  product RECORD;
BEGIN
  FOR product IN SELECT id FROM store_products WHERE is_active = TRUE
  LOOP
    PERFORM update_product_rating(product.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 초기 데이터: audio_categories
-- ============================================
INSERT INTO audio_categories (slug, label, color, order_index) VALUES
  ('walk_guide', '걷기 안내', 'green', 1),
  ('affirmation', '긍정확언', 'purple', 2),
  ('trail_guide', '길 안내', 'blue', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 초기 데이터: store_categories
-- ============================================
INSERT INTO store_categories (name, description, order_index) VALUES
  ('케어', '발 관리 및 케어 제품', 1),
  ('어싱', '어싱(접지) 관련 제품', 2),
  ('체험', '힐링로드 체험 프로그램', 3)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 초기 데이터: audio_tracks
-- ※ filename 기준으로 중복 체크 (재실행 안전)
-- ============================================
INSERT INTO audio_tracks (title, description, category, filename, emoji, order_index)
SELECT '걷기 시작하기', '걷기의 의미와 효과, 호흡과 스트레칭, 걷기 명상 안내', 'walk_guide', '1.걷기안내.wav', '🚶‍♀️', 1
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '1.걷기안내.wav');

INSERT INTO audio_tracks (title, description, category, filename, emoji, order_index)
SELECT '맨발걷기 안내', '맨발걷기의 효과와 안전한 맨발걷기 가이드', 'walk_guide', '2.맨발걷기안내.wav', '🚶‍♂️', 2
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '2.맨발걷기안내.wav');

INSERT INTO audio_tracks (title, description, category, filename, emoji, order_index)
SELECT '느티나무 삼십리길 안내', '강원도 철원군 화강 느티나무 삼십리길 소개', 'walk_guide', '3.길안내_1_화강 느티나무 삼십리길.wav', '🌳', 3
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '3.길안내_1_화강 느티나무 삼십리길.wav');

INSERT INTO audio_tracks (title, description, category, filename, emoji, order_index)
SELECT '군탄공원 안내', '강원도 철원군 군탄공원 및 맨발걷기길 소개', 'walk_guide', '3.길안내_2_군탄공원맨발걷기길.wav', '🌲', 4
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '3.길안내_2_군탄공원맨발걷기길.wav');

INSERT INTO audio_tracks (title, description, category, filename, emoji, order_index)
SELECT '걷기 마무리하기', '힐링로드 ON을 이용해 주셔서 감사합니다', 'walk_guide', '(기록_설문안내).wav', '😄', 5
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '(기록_설문안내).wav');

-- 긍정확언
INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '자기수용1', '나는 있는 그대로의 나를 사랑하고 존중합니다.', 'affirmation', '자기수용', '1.나는있는그대로의 나를 사랑하고 존중합니다.wav', '🌳', 1
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '1.나는있는그대로의 나를 사랑하고 존중합니다.wav');

INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '자기수용2', '나의 모든 경험은 나를 성장시키는 소중한 자산입니다.', 'affirmation', '자기수용', '2. 나의 모든경험은 나르 성장시키는 소중한 자산입니다.wav', '🌳', 2
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '2. 나의 모든경험은 나르 성장시키는 소중한 자산입니다.wav');

INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '성장1', '나는 매일 새로운 가능성을 향해 나아갑니다.', 'affirmation', '성장', '1.나는 매일 새로운 가능성을 향해 나아갑니다..wav', '🌱', 3
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '1.나는 매일 새로운 가능성을 향해 나아갑니다..wav');

INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '성장2', '나는 모든 경험에서 배우고 성장합니다.', 'affirmation', '성장', '2.나는 모든 경험에서 배우고 성장합니다..wav', '🌱', 4
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '2.나는 모든 경험에서 배우고 성장합니다..wav');

INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '자신감1', '나는 나의 진정한 목소리를 당당하게 표현합니다.', 'affirmation', '자신감', '1.나는 나의 진정한 목소리를 당당하게 표현합니다.wav', '🏖', 5
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '1.나는 나의 진정한 목소리를 당당하게 표현합니다.wav');

INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '자신감2', '나는 나의 강점과 재능을 온전히 발휘합니다.', 'affirmation', '자신감', '2. 나는 나의 강점과 재능을 온전히 발휘합니다.wav', '🏖', 6
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '2. 나는 나의 강점과 재능을 온전히 발휘합니다.wav');

INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '평화1', '나는 나의 마음에 평화와 고요함을 초대합니다.', 'affirmation', '평화', '1. 나는 나의 마음에 평화와 고요함을 초대합니다.wav', '🌫', 7
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '1. 나는 나의 마음에 평화와 고요함을 초대합니다.wav');

INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '평화2', '나는 지금 이순간에 온전히 머무르며, 나 자신을 치유합니다.', 'affirmation', '평화', '2. 나는 지금 이 순간에 온전히 머무르며, 나 자신을 치유합니다.wav', '🌫', 8
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '2. 나는 지금 이 순간에 온전히 머무르며, 나 자신을 치유합니다.wav');

INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index)
SELECT '감사', '나는 나의 삶에 주어진 모든 것에 감사합니다.', 'affirmation', '감사', '1.나는 나의 삶에 주어진 모든 것에 감사합니다.wav', '⛅', 9
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = '1.나는 나의 삶에 주어진 모든 것에 감사합니다.wav');

-- 길 안내
INSERT INTO audio_tracks (title, description, category, province, city, trail_name, filename, emoji, distance, walking_time, difficulty, order_index)
SELECT '화강 느티나무 삼십리길', '강원도 철원군 화강 느티나무 삼십리길 맨발걷기 코스 안내', 'trail_guide', 'gangwon', 'cheorwon', '느티나무 삼십리길', 'trail_cheorwon_1.wav', '🌳', '3.0km', '약 50분', 'moderate', 1
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = 'trail_cheorwon_1.wav');

INSERT INTO audio_tracks (title, description, category, province, city, trail_name, filename, emoji, distance, walking_time, difficulty, order_index)
SELECT '군탄공원 맨발걷기길', '강원도 철원군 군탄공원 맨발걷기길 코스 안내', 'trail_guide', 'gangwon', 'cheorwon', '군탄공원 맨발걷기길', 'trail_cheorwon_2.wav', '🌲', '2.5km', '약 40분', 'easy', 2
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = 'trail_cheorwon_2.wav');

INSERT INTO audio_tracks (title, description, category, province, city, trail_name, filename, emoji, distance, walking_time, difficulty, order_index)
SELECT '소양강 맨발 산책로', '춘천시 소양강을 따라 걷는 평화로운 맨발 코스', 'trail_guide', 'gangwon', 'chuncheon', '소양강 맨발 산책로', 'trail_chuncheon_1.wav', '🏞️', '2.5km', '약 40분', 'easy', 3
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = 'trail_chuncheon_1.wav');

INSERT INTO audio_tracks (title, description, category, province, city, trail_name, filename, emoji, distance, walking_time, difficulty, order_index)
SELECT '경포해변 맨발 워킹', '강릉시 경포해변의 모래사장을 걷는 해변 코스', 'trail_guide', 'gangwon', 'gangneung', '경포해변 맨발 워킹', 'trail_gangneung_1.wav', '🏖️', '2.8km', '약 45분', 'easy', 4
WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE filename = 'trail_gangneung_1.wav');

-- ============================================
-- 초기 데이터: news_articles
-- ※ link 기준으로 중복 체크 (재실행 안전)
-- ============================================
DO $$
BEGIN
  -- 이미 데이터가 있으면 삽입하지 않음
  IF NOT EXISTS (SELECT 1 FROM news_articles LIMIT 1) THEN
    INSERT INTO news_articles (title, source, category, link, thumbnail_url, published_at, order_index) VALUES
      ('화성시, 맨발걷기 산책로 24곳 조성 완료…일상 속 힐링 공간 확대', '중앙이코노미뉴스', '언론보도', 'https://www.joongangenews.com/news/articleView.html?idxno=478843', NULL, '2025-01-23', 1),
      ('맨발로 느끼는 힐링 보령시, 해변 맨발 걷기 눈길', '서울신문', '언론보도', 'https://news.zum.com/articles/100313495', NULL, '2025-01-02', 2),
      ('양홍식 제주도의원, 해변 맨발걷기 활성화 조례안 대표발의', '겟뉴스', '언론보도', 'https://www.getnews.co.kr/news/articleView.html?idxno=854027', NULL, '2024-12-18', 3),
      ('속초시, 맨발걷기 성지 입지 다진다…청초호 맨발걷기 길 본격 착공', '뉴스로', '언론보도', 'https://www.newsro.kr/article243/1005387/', NULL, '2024-12-20', 4),
      ('순천시, 노르딕워킹·맨발걷기 교실 수강생 모집', '뉴스로', '언론보도', 'https://www.newsro.kr/article243/779144/', NULL, '2024-12-15', 5),
      ('양평군, 맨발걷기국민운동본부와 맨발 걷기 딱 좋은 양평! 개최', '천지일보', '언론보도', 'https://www.newscj.com/news/articleView.html?idxno=3334562', NULL, '2024-10-31', 6),
      ('전진선 양평군수, 맨발걷기국민운동본부와 맨발걷기 활성화 협약', '위키트리', '언론보도', 'https://www.wikitree.co.kr/articles/1091779', NULL, '2024-10-30', 7),
      ('완도군, 제2회 명사십리 치유길 맨발 걷기 페스티벌 개최', '더팩트', '언론보도', 'https://news.tf.co.kr/read/national/2256646.htm', NULL, '2024-10-28', 8),
      ('문경새재 맨발페스티벌, 국내 최고의 힐링 걷기 축제와 건강 여행 명소 부상', '한국일보', '언론보도', 'https://www.hankookilbo.com/News/Read/A2025081708090000676', NULL, '2024-08-17', 9),
      ('산림치유·힐링·관광 한번에…대청호가 반기는 맨발걷기 성지', '서울경제', '언론보도', 'https://www.sedaily.com/NewsView/2H0FULUQ6F', NULL, '2024-11-13', 10),
      ('강원관광재단, 맨발걷기 프로그램 운영', '아주경제', '언론보도', 'https://www.ajunews.com/view/20240508134819150', NULL, '2024-05-08', 11),
      ('목포시, 부흥동 둥근공원에 황토맨발길 조성', '파이낸셜뉴스', '언론보도', 'https://www.fnnews.com/news/202405031446421698', NULL, '2024-05-03', 12),
      ('Walking barefoot on grass: 7 health benefits', 'Times of India', '해외자료', 'https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/walking-barefoot-on-grass-in-the-morning-7-health-benefits-from-improved-sleep-to-heart-health/articleshow/125869191.cms', '/images/news/news_walking-barefoot-on-grass.jpg', '2024-12-10', 13),
      ('Why walking barefoot can actually help your feet', 'National Geographic', '해외자료', 'https://www.nationalgeographic.com/science/article/why-walking-barefoot-can-actually-help-your-feet', '/images/news/news_why-walking-barefoot-help.jpg', '2024-11-15', 14),
      ('"Ditch your shoes": Why podiatrists advise 5-minute barefoot walking everyday', 'Economic Times', '해외자료', 'https://economictimes.indiatimes.com/news/india/ditch-your-shoes-why-podiatrists-advise-5-minute-barefoot-walking-everyday/boost-circulation-naturally/slideshow/123852206.cms', '/images/news/news_ditch-your-shoes.jpg', '2024-10-20', 15);
  END IF;
END $$;

-- ============================================
-- 초기 데이터: store_products
-- ※ 테이블이 비어있을 때만 삽입 (재실행 안전)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM store_products LIMIT 1) THEN
    INSERT INTO store_products (name, price, original_price, category, badge, rating, review_count, image_url, naver_product_url, order_index) VALUES
      ('[위드웰미] 데일리 파워 쿨링 미스트 100ml 풋미스트 발관리', 37800, 42000, '케어', '베스트', 5.0, 18, '/images/withwellme_powercoolingmist.jpg', 'https://smartstore.naver.com/withlab201/products/12254246304', 1),
      ('[위드웰미] 데일리 풋샴푸 풋워시 200ml 지장수 맨발걷기 발세정제', 17820, 19800, '케어', '인기', 5.0, 19, '/images/withwellme_dailyfootwash.jpg', 'https://smartstore.naver.com/withlab201/products/12248115925', 2),
      ('[숨토프랜드] 어싱 패드 접지 전자파차단 맨발걷기 맨땅밟기 매트 슈퍼싱글 퀸', 270000, NULL, '어싱', NULL, 0.0, 0, '/images/soomtofriend_earthingpad.jpg', 'https://smartstore.naver.com/withlab201/products/12362102946', 3),
      ('[숨토프랜드] 접지 어싱 베개 커버 숙면 맨발걷기 효과 힐링 60X70cm', 60000, NULL, '어싱', '추천', 0.0, 0, '/images/soomtofriend_earthingcover.jpg', 'https://smartstore.naver.com/withlab201/products/12314861939', 4),
      ('[힐링로드ON] 태백 웰니스 걷기 투어 (당일형)', 10000, NULL, '체험', NULL, 0.0, 0, '/images/withwellme_logo1.jpeg', 'https://smartstore.naver.com/withlab201/products/12679438666', 5);
  END IF;
END $$;

-- ============================================
-- 스키마 생성 완료
-- ============================================
-- 이 스크립트 실행 후 추가 필요 작업:
-- 1. Supabase Storage 버킷 생성: audio (Public), community-images (Public)
-- 2. audio 버킷에 빈 폴더 생성: walk_guide/, affirmation/, trail_guide/
-- 3. 환경변수 설정: SUPER_ADMIN_USER_ID (대표 계정 user_id)
