import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/healing'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const user = data.user

      // 카카오에서 받아온 사용자 정보
      // user.user_metadata에 카카오 프로필 정보가 들어있음
      const kakaoNickname = user.user_metadata?.full_name
        || user.user_metadata?.name
        || user.user_metadata?.user_name
        || null
      const kakaoAvatarUrl = user.user_metadata?.avatar_url || null

      // 기존 프로필이 있는지 확인
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id, nickname')
        .eq('user_id', user.id)
        .single()

      // 프로필이 없으면 카카오 닉네임으로 자동 생성
      if (!existingProfile) {
        await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            nickname: kakaoNickname,
            avatar_url: kakaoAvatarUrl,
          })
      }
      // 프로필은 있지만 닉네임이 없으면 카카오 닉네임으로 업데이트
      else if (!existingProfile.nickname && kakaoNickname) {
        await supabase
          .from('user_profiles')
          .update({
            nickname: kakaoNickname,
            avatar_url: kakaoAvatarUrl,
          })
          .eq('user_id', user.id)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 에러 발생 시 힐링 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/healing?error=auth_failed`)
}
