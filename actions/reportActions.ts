'use server'

import OpenAI from 'openai'
import { analyzeEmotionData, generateFallbackInsight, EMOTION_LABELS } from '@/lib/utils/emotionAnalysis'

interface EmotionRecord {
  id: string
  emotion_type: string
  intensity: number
  note: string | null
  created_at: string
}

/**
 * AI를 사용하여 감정 보고서 인사이트 생성
 */
export async function generateEmotionInsight(records: EmotionRecord[]) {
  try {
    if (records.length === 0) {
      return {
        success: true,
        insight: '이번 주에는 아직 기록된 감정이 없습니다. 힐링로드 ON에서 매일 감정을 기록해보세요!',
      }
    }

    const analysis = analyzeEmotionData(records)

    // OpenAI API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      // API 키가 없으면 기본 인사이트 반환
      return {
        success: true,
        insight: generateFallbackInsight(analysis),
      }
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // 프롬프트 생성
    const emotionSummaryText = analysis.summary
      .map((e) => `${e.label}(${e.emoji}): ${e.count}회, 평균 강도 ${e.avgIntensity}`)
      .join('\n')

    const notesText = records
      .filter((r) => r.note)
      .map((r) => `- ${EMOTION_LABELS[r.emotion_type]?.label || r.emotion_type}: "${r.note}"`)
      .slice(0, 5)
      .join('\n')

    const prompt = `당신은 따뜻하고 공감적인 웰니스 코치입니다. 사용자의 주간 감정 기록을 분석하고, 격려와 통찰이 담긴 짧은 보고서를 작성해주세요.

## 이번 주 감정 기록 (총 ${analysis.totalRecords}회)
${emotionSummaryText}

긍정적 감정 비율: ${analysis.positiveRatio}%

${notesText ? `## 사용자가 남긴 메모\n${notesText}` : ''}

## 요청사항
1. 2-3문장으로 이번 주 감정 패턴에 대한 따뜻한 피드백을 작성해주세요.
2. 구체적인 감정 데이터를 언급하며 공감해주세요.
3. 다음 주를 위한 짧은 격려의 말을 덧붙여주세요.
4. 한국어로 작성하고, 존댓말을 사용해주세요.
5. 이모지를 적절히 사용해주세요.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 사용자의 감정 건강을 돕는 따뜻한 웰니스 코치입니다. 공감적이고 격려하는 어조로 대화합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const insight = completion.choices[0]?.message?.content || generateFallbackInsight(analysis)

    return {
      success: true,
      insight,
    }
  } catch (error) {
    console.error('Generate emotion insight error:', error)
    // 에러 시 기본 인사이트 반환
    const analysis = analyzeEmotionData(records)
    return {
      success: true,
      insight: generateFallbackInsight(analysis),
    }
  }
}
