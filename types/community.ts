// 커뮤니티 게시판 관련 타입 정의

import type { BoardType, FreeBoardTopic } from '@/lib/constants/community'

// 게시글 인터페이스 (통합)
export interface CommunityPost {
  id: string
  user_id: string | null
  board_type: BoardType
  topic: FreeBoardTopic | null  // 자유게시판 전용
  title: string
  content: string
  thumbnail_url: string | null
  images: string[] | null
  author_nickname: string | null
  view_count: number
  comment_count: number
  is_pinned: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// 댓글 인터페이스
export interface CommunityComment {
  id: string
  post_id: string
  user_id: string | null
  content: string
  author_nickname: string | null
  created_at: string
}

// 인접 게시글 (이전글/다음글)
export interface AdjacentPost {
  id: string
  title: string
  content?: string  // 후기 게시판에서 본문 첫 줄 표시용
}

// 게시글 목록 Props (공통)
export interface PostListProps {
  boardType: BoardType
  posts: CommunityPost[]
  currentPage: number
  totalPages: number
  totalCount?: number
  isAdmin?: boolean
}

// 자유게시판 목록 Props
export interface FreeBoardListProps {
  posts: CommunityPost[]
  currentPage: number
  totalPages: number
  totalCount?: number
}

// 게시글 상세 Props
export interface PostDetailProps {
  post: CommunityPost
  comments: CommunityComment[]
  prevPost: AdjacentPost | null
  nextPost: AdjacentPost | null
  isAuthor: boolean
  isAdmin?: boolean
}
