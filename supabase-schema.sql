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
  age_group VARCHAR(20), -- '50대', '60대', '70대 이상' 등
  total_walks INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- 총 걷기 시간 (초)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================
-- 3. emotion_records 테이블 (감정 기록)
-- ============================================
CREATE TABLE IF NOT EXISTS emotion_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL 허용 (비로그인 사용자)
  session_id VARCHAR(100), -- 비로그인 사용자 식별용
  emotion_type VARCHAR(50) NOT NULL, -- 'happy', 'sad', 'angry', 'calm', 'tired' 등
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 5), -- 감정 강도 1-5
  note TEXT,
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
  board_type VARCHAR(20) NOT NULL CHECK (board_type IN ('notice', 'free', 'review')),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_nickname VARCHAR(50), -- 작성자 닉네임 (캐싱용)
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE, -- 공지사항 상단 고정
  is_active BOOLEAN DEFAULT TRUE, -- 삭제 처리 (soft delete)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_community_posts_board_type ON community_posts(board_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_active ON community_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_pinned ON community_posts(is_pinned);

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

COMMENT ON TABLE audio_tracks IS '오디오 트랙 정보 (걷기 안내, 긍정확언)';
COMMENT ON TABLE user_profiles IS '사용자 프로필 및 통계';
COMMENT ON TABLE emotion_records IS '감정 기록 (비로그인 사용자 포함)';
COMMENT ON TABLE walk_sessions IS '걷기 세션 기록';
COMMENT ON TABLE community_posts IS '커뮤니티 게시판 글 (공지사항, 자유게시판, 힐링 후기)';
COMMENT ON TABLE community_comments IS '커뮤니티 게시판 댓글';
