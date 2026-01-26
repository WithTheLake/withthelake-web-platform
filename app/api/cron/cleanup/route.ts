import { NextResponse } from 'next/server'
import { cleanupOldDeletedData } from '@/actions/cleanupActions'

/**
 * Vercel Cron Job - 매일 새벽 3시(KST) 실행
 * 30일이 지난 soft-deleted 데이터를 hard delete
 */
export async function GET(request: Request) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get('authorization')

  // 로컬 개발 환경에서는 인증 스킵
  if (process.env.NODE_ENV === 'production') {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  try {
    const result = await cleanupOldDeletedData()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        details: result.details,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[Cron Cleanup] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Vercel Cron이 사용하는 설정
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 최대 60초
