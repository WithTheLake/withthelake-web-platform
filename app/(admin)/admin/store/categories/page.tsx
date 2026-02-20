'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Loader2, GripVertical } from 'lucide-react'
import {
  getAdminStoreCategories,
  createStoreCategory,
  updateStoreCategory,
  deleteStoreCategory,
  type StoreCategoryItem,
} from '@/actions/storeActions'
import { useToast } from '@/components/ui/Toast'

export default function AdminStoreCategoriesPage() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<StoreCategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 추가 폼
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newOrderIndex, setNewOrderIndex] = useState('0')
  const [isAdding, setIsAdding] = useState(false)

  // 수정 상태
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editOrderIndex, setEditOrderIndex] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchCategories = async () => {
    setIsLoading(true)
    const data = await getAdminStoreCategories()
    setCategories(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setIsAdding(true)

    const result = await createStoreCategory({
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      order_index: parseInt(newOrderIndex) || 0,
    })

    if (result.success) {
      setNewName('')
      setNewDescription('')
      setNewOrderIndex('0')
      setShowAddForm(false)
      fetchCategories()
    } else {
      showToast(result.message || '카테고리 추가에 실패했습니다.', 'error')
    }
    setIsAdding(false)
  }

  const handleStartEdit = (cat: StoreCategoryItem) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDescription(cat.description || '')
    setEditOrderIndex(cat.order_index.toString())
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return
    setIsSaving(true)

    const result = await updateStoreCategory(editingId, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
      order_index: parseInt(editOrderIndex) || 0,
    })

    if (result.success) {
      setEditingId(null)
      fetchCategories()
    } else {
      showToast(result.message || '카테고리 수정에 실패했습니다.', 'error')
    }
    setIsSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return

    const result = await deleteStoreCategory(id)
    if (result.success) {
      fetchCategories()
    } else {
      showToast(result.message || '카테고리 삭제에 실패했습니다.', 'error')
    }
  }

  const handleToggleActive = async (cat: StoreCategoryItem) => {
    const message = cat.is_active
      ? `"${cat.name}" 카테고리를 비활성화하시겠습니까?`
      : `"${cat.name}" 카테고리를 활성화하시겠습니까?`
    if (!confirm(message)) return

    const result = await updateStoreCategory(cat.id, { is_active: !cat.is_active })
    if (result.success) {
      fetchCategories()
    } else {
      showToast(result.message || '상태 변경에 실패했습니다.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/store"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">카테고리 관리</h1>
            <p className="text-gray-500 mt-1">스토어 상품 카테고리를 관리합니다.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          카테고리 추가
        </button>
      </div>

      {/* 추가 폼 */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-green-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">새 카테고리 추가</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="예: 케어"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="카테고리 설명"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
              <input
                type="number"
                value={newOrderIndex}
                onChange={(e) => setNewOrderIndex(e.target.value)}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              추가
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 카테고리 목록 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                순서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                상태
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  등록된 카테고리가 없습니다.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className={`hover:bg-gray-50 ${!cat.is_active ? 'opacity-50' : ''}`}>
                  {editingId === cat.id ? (
                    // 수정 모드
                    <>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          value={editOrderIndex}
                          onChange={(e) => setEditOrderIndex(e.target.value)}
                          min={0}
                          className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {cat.is_active ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="저장"
                          >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                            title="취소"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // 조회 모드
                    <>
                      <td className="px-4 py-4 text-center text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-1">
                          <GripVertical size={14} className="text-gray-300" />
                          {cat.order_index}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {cat.description || '-'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(cat)}
                          className={`inline-flex px-2 py-0.5 text-xs rounded-full cursor-pointer transition-colors ${
                            cat.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {cat.is_active ? '활성' : '비활성'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="수정"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
