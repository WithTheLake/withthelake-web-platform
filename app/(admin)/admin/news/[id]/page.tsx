import { notFound } from 'next/navigation'
import { getNewsArticle } from '@/actions/newsActions'
import { NewsForm } from '@/components/admin/NewsForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminNewsEditPage({ params }: Props) {
  const { id } = await params
  const news = await getNewsArticle(id)

  if (!news) {
    notFound()
  }

  return <NewsForm news={news} mode="edit" />
}
