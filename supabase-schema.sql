-- WithTheLake Database Schema
-- Supabase PostgreSQL Schema for Healing Road ON

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. audio_tracks 테이블 (오디오 트랙 정보)
-- ============================================
CREATE TABLE IF NOT EXISTS audio_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('walk_guide', 'affirmation', 'trail_guide')),
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

-- Index for faster category queries
CREATE INDEX IF NOT EXISTS idx_audio_tracks_category ON audio_tracks(category);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_subcategory ON audio_tracks(subcategory);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_province ON audio_tracks(province);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_city ON audio_tracks(city);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_active ON audio_tracks(is_active);

-- ============================================
-- 2. user_profiles 테이블 (사용자 프로필)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nickname VARCHAR(50),
  avatar_url TEXT, -- 카카오 프로필 이미지 URL
  age_group VARCHAR(20), -- '50대', '60대', '70대 이상' 등
  is_admin BOOLEAN DEFAULT FALSE, -- 관리자 여부
  total_walks INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- 총 걷기 시간 (초)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 관리자 인덱스
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin ON user_profiles(is_admin);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

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

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_emotion_records_user_id ON emotion_records(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_records_session_id ON emotion_records(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_records_created_at ON emotion_records(created_at DESC);

-- ============================================
-- 4. walk_sessions 테이블 (걷기 세션)
-- ============================================
CREATE TABLE IF NOT EXISTS walk_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL 허용
  session_id VARCHAR(100) NOT NULL,
  audio_track_id UUID REFERENCES audio_tracks(id) ON DELETE SET NULL,
  start_location JSONB, -- { "lat": number, "lng": number }
  end_location JSONB,
  duration INTEGER, -- 걷기 시간 (초)
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_walk_sessions_user_id ON walk_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_walk_sessions_session_id ON walk_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_walk_sessions_started_at ON walk_sessions(started_at DESC);

-- ============================================
-- 5. community_posts 테이블 (커뮤니티 게시판)
-- ============================================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  board_type VARCHAR(20) NOT NULL CHECK (board_type IN ('notice', 'event', 'free', 'review')),
  topic VARCHAR(20), -- 말머리 (자유게시판용: 잡담, 질문, 정보, 후기)
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT, -- 썸네일 이미지 URL (이벤트/후기 게시판용)
  images TEXT[], -- 이미지 URL 배열 (여러 장 첨부 가능)
  author_nickname VARCHAR(50), -- 작성자 닉네임 (캐싱용)
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0, -- 댓글 수 (캐싱용)
  is_pinned BOOLEAN DEFAULT FALSE, -- 공지사항 상단 고정
  is_active BOOLEAN DEFAULT TRUE, -- 삭제 처리 (soft delete)
  -- 후기 게시판 전용 필드
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5 AND (rating * 2) = FLOOR(rating * 2)), -- 평점 (1-5점, 0.5 단위)
  product_id UUID REFERENCES store_products(id) ON DELETE SET NULL, -- 연결된 상품 (후기 게시판용)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_community_posts_board_type ON community_posts(board_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_active ON community_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_pinned ON community_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_community_posts_product_id ON community_posts(product_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_rating ON community_posts(rating);

-- ============================================
-- 6. community_comments 테이블 (댓글)
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);

-- ============================================
-- Row Level Security (RLS) 정책
-- ============================================

-- audio_tracks: 모든 사용자가 읽기 가능
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active audio tracks"
  ON audio_tracks
  FOR SELECT
  USING (is_active = TRUE);

-- user_profiles: 자신의 프로필만 읽기/쓰기 가능
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- emotion_records: 자신의 기록만 읽기/쓰기 가능 (비로그인도 생성 가능)
ALTER TABLE emotion_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own emotion records"
  ON emotion_records
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert emotion records"
  ON emotion_records
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can update own emotion records"
  ON emotion_records
  FOR UPDATE
  USING (auth.uid() = user_id);

-- walk_sessions: 자신의 세션만 읽기/쓰기 가능 (비로그인도 생성 가능)
ALTER TABLE walk_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own walk sessions"
  ON walk_sessions
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert walk sessions"
  ON walk_sessions
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can update own walk sessions"
  ON walk_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- community_posts: 모든 사용자가 읽기 가능, 로그인 사용자만 작성 가능, 자신의 글만 수정/삭제
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active posts"
  ON community_posts
  FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Authenticated users can insert posts"
  ON community_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts (soft delete)"
  ON community_posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- community_comments: 모든 사용자가 읽기 가능, 로그인 사용자만 작성 가능, 자신의 댓글만 수정/삭제
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active comments"
  ON community_comments
  FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Authenticated users can insert comments"
  ON community_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON community_comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments (soft delete)"
  ON community_comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Triggers for updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for audio_tracks
CREATE TRIGGER update_audio_tracks_updated_at
  BEFORE UPDATE ON audio_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for community_posts
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for community_comments
CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data (Optional - 초기 오디오 데이터)
-- 실제 public/audio 폴더의 파일명과 일치해야 합니다
-- ============================================

-- 기존 데이터 삭제 (재실행 시)
DELETE FROM audio_tracks;

-- 걷기 안내 오디오 트랙
INSERT INTO audio_tracks (title, description, category, filename, emoji, order_index) VALUES
  ('걷기 시작하기', '걷기의 의미와 효과, 호흡과 스트레칭, 걷기 명상 안내', 'walk_guide', '1.걷기안내.wav', '🚶‍♀️', 1),
  ('맨발걷기 안내', '맨발걷기의 효과와 안전한 맨발걷기 가이드', 'walk_guide', '2.맨발걷기안내.wav', '🚶‍♂️', 2),
  ('느티나무 삼십리길 안내', '강원도 철원군 화강 느티나무 삼십리길 소개', 'walk_guide', '3.길안내_1_화강 느티나무 삼십리길.wav', '🌳', 3),
  ('군탄공원 안내', '강원도 철원군 군탄공원 및 맨발걷기길 소개', 'walk_guide', '3.길안내_2_군탄공원맨발걷기길.wav', '🌲', 4),
  ('걷기 마무리하기', '힐링로드 ON을 이용해 주셔서 감사합니다', 'walk_guide', '(기록_설문안내).wav', '😄', 5);

-- 긍정확언 오디오 트랙 (subcategory로 분류)
INSERT INTO audio_tracks (title, description, category, subcategory, filename, emoji, order_index) VALUES
  ('자기수용1', '나는 있는 그대로의 나를 사랑하고 존중합니다.', 'affirmation', '자기수용', '1.나는있는그대로의 나를 사랑하고 존중합니다.wav', '🌳', 1),
  ('자기수용2', '나의 모든 경험은 나를 성장시키는 소중한 자산입니다.', 'affirmation', '자기수용', '2. 나의 모든경험은 나르 성장시키는 소중한 자산입니다.wav', '🌳', 2),
  ('성장1', '나는 매일 새로운 가능성을 향해 나아갑니다.', 'affirmation', '성장', '1.나는 매일 새로운 가능성을 향해 나아갑니다..wav', '🌱', 3),
  ('성장2', '나는 모든 경험에서 배우고 성장합니다.', 'affirmation', '성장', '2.나는 모든 경험에서 배우고 성장합니다..wav', '🌱', 4),
  ('자신감1', '나는 나의 진정한 목소리를 당당하게 표현합니다.', 'affirmation', '자신감', '1.나는 나의 진정한 목소리를 당당하게 표현합니다.wav', '🏖', 5),
  ('자신감2', '나는 나의 강점과 재능을 온전히 발휘합니다.', 'affirmation', '자신감', '2. 나는 나의 강점과 재능을 온전히 발휘합니다.wav', '🏖', 6),
  ('평화1', '나는 나의 마음에 평화와 고요함을 초대합니다.', 'affirmation', '평화', '1. 나는 나의 마음에 평화와 고요함을 초대합니다.wav', '🌫', 7),
  ('평화2', '나는 지금 이순간에 온전히 머무르며, 나 자신을 치유합니다.', 'affirmation', '평화', '2. 나는 지금 이 순간에 온전히 머무르며, 나 자신을 치유합니다.wav', '🌫', 8),
  ('감사', '나는 나의 삶에 주어진 모든 것에 감사합니다.', 'affirmation', '감사', '1.나는 나의 삶에 주어진 모든 것에 감사합니다.wav', '⛅', 9);

-- 길 안내 오디오 트랙 (지역별 분류)
INSERT INTO audio_tracks (title, description, category, province, city, trail_name, filename, emoji, distance, walking_time, difficulty, order_index) VALUES
  ('화강 느티나무 삼십리길', '강원도 철원군 화강 느티나무 삼십리길 맨발걷기 코스 안내', 'trail_guide', 'gangwon', 'cheorwon', '느티나무 삼십리길', 'trail_cheorwon_1.wav', '🌳', '3.0km', '약 50분', 'moderate', 1),
  ('군탄공원 맨발걷기길', '강원도 철원군 군탄공원 맨발걷기길 코스 안내', 'trail_guide', 'gangwon', 'cheorwon', '군탄공원 맨발걷기길', 'trail_cheorwon_2.wav', '🌲', '2.5km', '약 40분', 'easy', 2),
  ('소양강 맨발 산책로', '춘천시 소양강을 따라 걷는 평화로운 맨발 코스', 'trail_guide', 'gangwon', 'chuncheon', '소양강 맨발 산책로', 'trail_chuncheon_1.wav', '🏞️', '2.5km', '약 40분', 'easy', 3),
  ('경포해변 맨발 워킹', '강릉시 경포해변의 모래사장을 걷는 해변 코스', 'trail_guide', 'gangwon', 'gangneung', '경포해변 맨발 워킹', 'trail_gangneung_1.wav', '🏖️', '2.8km', '약 45분', 'easy', 4);

-- ============================================
-- 7. emotion_reports 테이블 (주간 감정 보고서)
-- ============================================
CREATE TABLE IF NOT EXISTS emotion_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL, -- 주간 시작일 (월요일)
  week_end DATE NOT NULL, -- 주간 종료일 (일요일)
  total_records INTEGER DEFAULT 0, -- 해당 주 총 기록 수
  positive_ratio INTEGER DEFAULT 0, -- 긍정적 감정 비율 (%)
  emotion_summary JSONB, -- 감정별 통계 (예: [{ "type": "calm", "count": 5, "avgIntensity": 3.5 }])
  top_helpful_actions TEXT[], -- 도움이 된 행동 TOP 3
  top_positive_changes TEXT[], -- 긍정적 변화 TOP 3
  ai_insight TEXT, -- AI 생성 인사이트
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for emotion_reports
CREATE INDEX IF NOT EXISTS idx_emotion_reports_user_id ON emotion_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_reports_week_start ON emotion_reports(week_start DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_emotion_reports_user_week ON emotion_reports(user_id, week_start);

-- RLS for emotion_reports
ALTER TABLE emotion_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reports"
  ON emotion_reports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON emotion_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON emotion_reports
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE audio_tracks IS '오디오 트랙 정보 (걷기 안내, 긍정확언)';
COMMENT ON TABLE user_profiles IS '사용자 프로필 및 통계';
COMMENT ON TABLE emotion_records IS '감정 기록 (비로그인 사용자 포함)';
COMMENT ON TABLE walk_sessions IS '걷기 세션 기록';
COMMENT ON TABLE community_posts IS '커뮤니티 게시판 글 (공지사항, 자유게시판, 힐링 후기)';
COMMENT ON TABLE community_comments IS '커뮤니티 게시판 댓글';
COMMENT ON TABLE emotion_reports IS '주간 감정 보고서 (AI 인사이트 포함)';

-- ============================================
-- 8. news_articles 테이블 (뉴스/언론 보도)
-- ============================================
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  source VARCHAR(100) NOT NULL, -- 언론사명 (예: '중앙이코노미뉴스', 'Times of India')
  category VARCHAR(50) NOT NULL CHECK (category IN ('언론보도', '해외자료', '블로그', '보도자료')),
  link TEXT NOT NULL, -- 기사 원문 링크
  thumbnail_url TEXT, -- 썸네일 이미지 URL (해외자료에서 주로 사용)
  published_at DATE NOT NULL, -- 기사 발행일
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0, -- 정렬 순서 (낮을수록 먼저)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for news_articles
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_active ON news_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_news_articles_order_index ON news_articles(order_index);

-- RLS for news_articles: 모든 사용자가 읽기 가능, 관리자만 쓰기 가능
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active news"
  ON news_articles
  FOR SELECT
  USING (is_active = TRUE);

-- 관리자만 뉴스 작성/수정/삭제 (service_role 키 사용)
-- INSERT/UPDATE/DELETE는 Server Action에서 service_role 키로 수행

-- Trigger for updated_at
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE news_articles IS '뉴스/언론 보도 (관리자만 작성 가능)';

-- ============================================
-- 9. store_products 테이블 (스토어 상품)
-- ============================================
CREATE TABLE IF NOT EXISTS store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL, -- 상품명
  price INTEGER NOT NULL, -- 판매가 (원)
  original_price INTEGER, -- 정가 (할인 전, NULL이면 할인 없음)
  category VARCHAR(50) NOT NULL, -- 카테고리 (케어, 어싱, 기록 등)
  badge VARCHAR(20), -- 뱃지 (베스트, 인기, 추천, 신상품)
  rating DECIMAL(2,1) DEFAULT 0.0, -- 평점 (0.0 ~ 5.0)
  review_count INTEGER DEFAULT 0, -- 리뷰 수
  image_url TEXT, -- 상품 이미지 URL
  naver_product_url TEXT, -- 네이버 스마트스토어 상품 링크
  description TEXT, -- 상품 설명 (선택)
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0, -- 정렬 순서 (낮을수록 먼저)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for store_products
CREATE INDEX IF NOT EXISTS idx_store_products_category ON store_products(category);
CREATE INDEX IF NOT EXISTS idx_store_products_is_active ON store_products(is_active);
CREATE INDEX IF NOT EXISTS idx_store_products_order_index ON store_products(order_index);

-- RLS for store_products: 모든 사용자가 읽기 가능, 관리자만 쓰기 가능
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON store_products
  FOR SELECT
  USING (is_active = TRUE);

-- Trigger for updated_at
CREATE TRIGGER update_store_products_updated_at
  BEFORE UPDATE ON store_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE store_products IS '스토어 상품 (관리자만 작성 가능)';

-- ============================================
-- RPC 함수: 댓글 수 증가/감소
-- ============================================

-- 댓글 수 증가 함수
CREATE OR REPLACE FUNCTION increment_comment_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET comment_count = comment_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 댓글 수 감소 함수
CREATE OR REPLACE FUNCTION decrement_comment_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts
  SET comment_count = GREATEST(comment_count - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 초기 데이터: news_articles
-- ============================================
INSERT INTO news_articles (title, source, category, link, thumbnail_url, published_at, order_index) VALUES
-- 국내 언론 보도 (최신순)
('화성시, 맨발걷기 산책로 24곳 조성 완료…일상 속 힐링 공간 확대', '중앙이코노미뉴스', '언론보도', 'https://www.joongangenews.com/news/articleView.html?idxno=478843', NULL, '2025-01-23', 1),
('''맨발로 느끼는 힐링'' 보령시, 해변 맨발 걷기 ''눈길''', '서울신문', '언론보도', 'https://news.zum.com/articles/100313495', NULL, '2025-01-02', 2),
('양홍식 제주도의원, 해변 맨발걷기 활성화 조례안 대표발의', '겟뉴스', '언론보도', 'https://www.getnews.co.kr/news/articleView.html?idxno=854027', NULL, '2024-12-18', 3),
('속초시, 맨발걷기 성지 입지 다진다…청초호 맨발걷기 길 본격 착공', '뉴스로', '언론보도', 'https://www.newsro.kr/article243/1005387/', NULL, '2024-12-20', 4),
('순천시, 노르딕워킹·맨발걷기 교실 수강생 모집', '뉴스로', '언론보도', 'https://www.newsro.kr/article243/779144/', NULL, '2024-12-15', 5),
('양평군, 맨발걷기국민운동본부와 ''맨발 걷기 딱 좋은 양평!'' 개최', '천지일보', '언론보도', 'https://www.newscj.com/news/articleView.html?idxno=3334562', NULL, '2024-10-31', 6),
('전진선 양평군수, 맨발걷기국민운동본부와 ''맨발걷기 활성화'' 협약', '위키트리', '언론보도', 'https://www.wikitree.co.kr/articles/1091779', NULL, '2024-10-30', 7),
('완도군, ''제2회 명사십리 치유길 맨발 걷기 페스티벌'' 개최', '더팩트', '언론보도', 'https://news.tf.co.kr/read/national/2256646.htm', NULL, '2024-10-28', 8),
('문경새재 맨발페스티벌, 국내 최고의 힐링 걷기 축제와 건강 여행 명소 부상', '한국일보', '언론보도', 'https://www.hankookilbo.com/News/Read/A2025081708090000676', NULL, '2024-08-17', 9),
('산림치유·힐링·관광 한번에…대청호가 반기는 ''맨발걷기 성지''', '서울경제', '언론보도', 'https://www.sedaily.com/NewsView/2H0FULUQ6F', NULL, '2024-11-13', 10),
('강원관광재단, 맨발걷기 프로그램 운영', '아주경제', '언론보도', 'https://www.ajunews.com/view/20240508134819150', NULL, '2024-05-08', 11),
('목포시, 부흥동 둥근공원에 황토맨발길 조성', '파이낸셜뉴스', '언론보도', 'https://www.fnnews.com/news/202405031446421698', NULL, '2024-05-03', 12),
-- 해외 건강/웰니스 기사
('Walking barefoot on grass: 7 health benefits', 'Times of India', '해외자료', 'https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/walking-barefoot-on-grass-in-the-morning-7-health-benefits-from-improved-sleep-to-heart-health/articleshow/125869191.cms', '/images/news/news_walking-barefoot-on-grass.jpg', '2024-12-10', 13),
('Why walking barefoot can actually help your feet', 'National Geographic', '해외자료', 'https://www.nationalgeographic.com/science/article/why-walking-barefoot-can-actually-help-your-feet', '/images/news/news_why-walking-barefoot-help.jpg', '2024-11-15', 14),
('"Ditch your shoes": Why podiatrists advise 5-minute barefoot walking everyday', 'Economic Times', '해외자료', 'https://economictimes.indiatimes.com/news/india/ditch-your-shoes-why-podiatrists-advise-5-minute-barefoot-walking-everyday/boost-circulation-naturally/slideshow/123852206.cms', '/images/news/news_ditch-your-shoes.jpg', '2024-10-20', 15)
ON CONFLICT DO NOTHING;

-- ============================================
-- 초기 데이터: store_products (상품 1-5)
-- ============================================
INSERT INTO store_products (name, price, original_price, category, badge, rating, review_count, image_url, naver_product_url, order_index) VALUES
('[위드웰미] 데일리 파워 쿨링 미스트 100ml 풋미스트 발관리', 37800, 42000, '케어', '베스트', 5.0, 18, '/images/withwellme_powercoolingmist.jpg', 'https://smartstore.naver.com/withlab201/products/12254246304', 1),
('[위드웰미] 데일리 풋샴푸 풋워시 200ml 지장수 맨발걷기 발세정제', 17820, 19800, '케어', '인기', 5.0, 19, '/images/withwellme_dailyfootwash.jpg', 'https://smartstore.naver.com/withlab201/products/12248115925', 2),
('[숨토프랜드] 어싱 패드 접지 전자파차단 맨발걷기 맨땅밟기 매트 슈퍼싱글 퀸', 270000, NULL, '어싱', NULL, 0.0, 0, '/images/soomtofriend_earthingpad.jpg', 'https://smartstore.naver.com/withlab201/products/12362102946', 3),
('[숨토프랜드] 접지 어싱 베개 커버 숙면 맨발걷기 효과 힐링 60X70cm', 60000, NULL, '어싱', '추천', 0.0, 0, '/images/soomtofriend_earthingcover.jpg', 'https://smartstore.naver.com/withlab201/products/12314861939', 4),
('[힐링로드ON] 태백 웰니스 걷기 투어 (당일형)', 10000, NULL, '체험', NULL, 0.0, 0, '/images/withwellme_logo1.jpeg', 'https://smartstore.naver.com/withlab201/products/12679438666', 5)
ON CONFLICT DO NOTHING;

-- ============================================
-- 마이그레이션: community_posts에 후기 관련 컬럼 추가
-- (기존 테이블에 컬럼이 없는 경우 실행)
-- ============================================
DO $$
BEGIN
  -- rating 컬럼 추가 (DECIMAL 타입, 0.5 단위 지원)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'rating'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5 AND (rating * 2) = FLOOR(rating * 2));
  END IF;

  -- 기존 INTEGER rating을 DECIMAL로 변환 (이미 존재하는 경우)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'rating' AND data_type = 'integer'
  ) THEN
    ALTER TABLE community_posts ALTER COLUMN rating TYPE DECIMAL(2,1);
    ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS community_posts_rating_check;
    ALTER TABLE community_posts ADD CONSTRAINT community_posts_rating_check CHECK (rating >= 1 AND rating <= 5 AND (rating * 2) = FLOOR(rating * 2));
  END IF;

  -- product_id 컬럼 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'product_id'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN product_id UUID REFERENCES store_products(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================
-- RPC 함수: 상품 평점/리뷰수 업데이트
-- ============================================

-- 상품의 평균 평점과 리뷰 수 재계산 함수
CREATE OR REPLACE FUNCTION update_product_rating(p_product_id UUID)
RETURNS VOID AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  total_reviews INTEGER;
BEGIN
  -- 해당 상품의 활성화된 리뷰에서 평균 평점과 리뷰 수 계산
  SELECT
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0),
    COUNT(*)
  INTO avg_rating, total_reviews
  FROM community_posts
  WHERE product_id = p_product_id
    AND board_type = 'review'
    AND is_active = TRUE
    AND rating IS NOT NULL;

  -- store_products 테이블 업데이트
  UPDATE store_products
  SET
    rating = avg_rating,
    review_count = total_reviews,
    updated_at = NOW()
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- 모든 상품의 평점/리뷰수 일괄 업데이트 함수
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
