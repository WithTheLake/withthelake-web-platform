import { notFound } from 'next/navigation'
import { getStoreProduct } from '@/actions/storeActions'
import { StoreForm } from '@/components/admin/StoreForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminStoreEditPage({ params }: Props) {
  const { id } = await params
  const product = await getStoreProduct(id)

  if (!product) {
    notFound()
  }

  return <StoreForm product={product} mode="edit" />
}
