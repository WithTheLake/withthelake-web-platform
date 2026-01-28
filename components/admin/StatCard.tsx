import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  href: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink'
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  pink: 'bg-pink-50 text-pink-600',
}

export function StatCard({
  title,
  value,
  icon: Icon,
  href,
  color = 'blue',
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={cn('p-3 rounded-lg', colorStyles[color])}>
          <Icon size={24} />
        </div>
      </div>
    </Link>
  )
}
