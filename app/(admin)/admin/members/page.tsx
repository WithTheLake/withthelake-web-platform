'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, ShieldOff, User, Crown, X, FileText, MessageSquare, Ban, CheckCircle, UserX, UserCheck } from 'lucide-react'
import {
  getAdminMembers,
  toggleMemberAdmin,
  toggleMemberBlock,
  banMember,
  unbanMember,
  getMemberDetail,
  checkIsSuperAdmin,
  getSuperAdminUserId,
  type AdminMember,
  type MemberDetail,
} from '@/actions/adminActions'
import { formatDate, formatDateTime } from '@/lib/utils/format'

const ITEMS_PER_PAGE = 20
const FILTERS: { value: 'all' | 'admin' | 'general'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'admin', label: '관리자' },
  { value: 'general', label: '일반 회원' },
]

export default function AdminMembersPage() {
  const [members, setMembers] = useState<AdminMember[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'admin' | 'general'>('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [superAdminUserId, setSuperAdminUserId] = useState<string | null>(null)

  // 상세 모달
  const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // 대표 권한 및 대표 user_id 확인
  useEffect(() => {
    checkIsSuperAdmin().then(setIsSuperAdmin)
    getSuperAdminUserId().then(setSuperAdminUserId)
  }, [])

  const fetchMembers = async () => {
    setIsLoading(true)
    const result = await getAdminMembers({
      search: search || undefined,
      filter,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    })
    setMembers(result.data)
    setTotalCount(result.count)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [filter, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchMembers()
  }

  const handleToggleAdmin = async (member: AdminMember) => {
    const newAdminStatus = !member.is_admin
    const message = newAdminStatus
      ? `"${member.nickname || '(닉네임 없음)'}" 회원에게 관리자 권한을 부여하시겠습니까?`
      : `"${member.nickname || '(닉네임 없음)'}" 회원의 관리자 권한을 해제하시겠습니까?`
    if (!confirm(message)) return

    const result = await toggleMemberAdmin(member.user_id, newAdminStatus)
    if (result.success) {
      fetchMembers()
      // 모달이 열려있으면 상세 정보도 갱신
      if (selectedMember?.user_id === member.user_id) {
        handleOpenDetail(member)
      }
    } else {
      alert(result.error || '권한 변경에 실패했습니다.')
    }
  }

  const handleToggleBlock = async (member: AdminMember | MemberDetail) => {
    const isBlocked = member.is_blocked ?? false
    const newBlockStatus = !isBlocked
    const message = newBlockStatus
      ? `"${member.nickname || '(닉네임 없음)'}" 회원을 차단하시겠습니까?\n차단된 회원은 글쓰기와 댓글 작성이 제한됩니다.`
      : `"${member.nickname || '(닉네임 없음)'}" 회원의 차단을 해제하시겠습니까?`
    if (!confirm(message)) return

    const result = await toggleMemberBlock(member.user_id, newBlockStatus)
    if (result.success) {
      fetchMembers()
      if (selectedMember?.user_id === member.user_id) {
        handleOpenDetail(member)
      }
    } else {
      alert(result.error || '차단 상태 변경에 실패했습니다.')
    }
  }

  const handleBan = async (member: MemberDetail) => {
    const message = `"${member.nickname || '(닉네임 없음)'}" 회원을 강퇴하시겠습니까?\n\n⚠️ 강퇴된 회원은 로그인이 불가능하며, 같은 카카오 계정으로 재가입할 수 없습니다.`
    if (!confirm(message)) return

    const result = await banMember(member.user_id)
    if (result.success) {
      fetchMembers()
      handleOpenDetail(member)
    } else {
      alert(result.error || '강퇴 처리에 실패했습니다.')
    }
  }

  const handleUnban = async (member: MemberDetail) => {
    const message = `"${member.nickname || '(닉네임 없음)'}" 회원의 강퇴를 해제하시겠습니까?\n해제 시 다시 로그인이 가능해집니다.`
    if (!confirm(message)) return

    const result = await unbanMember(member.user_id)
    if (result.success) {
      fetchMembers()
      handleOpenDetail(member)
    } else {
      alert(result.error || '강퇴 해제에 실패했습니다.')
    }
  }

  const handleOpenDetail = async (member: AdminMember | MemberDetail) => {
    setIsDetailLoading(true)
    setSelectedMember(null)
    const result = await getMemberDetail(member.user_id)
    if (result.success && result.data) {
      setSelectedMember(result.data)
    } else {
      alert(result.error || '회원 정보를 불러올 수 없습니다.')
    }
    setIsDetailLoading(false)
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '-'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}시간 ${minutes}분`
    return `${minutes}분`
  }

  // 해당 회원이 대표인지 확인
  const isMemberSuperAdmin = (member: AdminMember | MemberDetail) => {
    return superAdminUserId !== null && member.user_id === superAdminUserId
  }

  // 권한 뱃지 렌더링
  const renderRoleBadge = (member: AdminMember | MemberDetail) => {
    if (isMemberSuperAdmin(member)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
          <Crown size={12} />
          대표
        </span>
      )
    }
    if (member.is_admin) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
          관리자
        </span>
      )
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
        일반
      </span>
    )
  }

  // 상태 뱃지 렌더링 (차단/강퇴)
  const renderStatusBadge = (member: AdminMember | MemberDetail) => {
    // MemberDetail에만 is_banned이 있음
    const isBanned = 'is_banned' in member && member.is_banned
    if (isBanned) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-200 text-red-800">
          <UserX size={10} />
          강퇴
        </span>
      )
    }
    if (member.is_blocked) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
          <Ban size={10} />
          차단
        </span>
      )
    }
    return null
  }

  // 관리 버튼 렌더링
  const renderActionButton = (member: AdminMember) => {
    // 대표 계정은 권한 변경 불가
    if (isMemberSuperAdmin(member)) {
      return (
        <span className="text-xs text-gray-400">-</span>
      )
    }

    // 대표만 관리자 임명/해제 가능
    if (!isSuperAdmin) {
      return (
        <span className="text-xs text-gray-400">-</span>
      )
    }

    if (member.is_admin) {
      return (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleAdmin(member) }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <ShieldOff size={14} />
          권한 해제
        </button>
      )
    }

    return (
      <button
        onClick={(e) => { e.stopPropagation(); handleToggleAdmin(member) }}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
      >
        <Shield size={14} />
        관리자 임명
      </button>
    )
  }

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p className="text-gray-500 mt-1">
          총 {totalCount}명의 회원
          {!isSuperAdmin && (
            <span className="ml-2 text-xs text-amber-600">(관리자 임명/해제는 대표만 가능)</span>
          )}
        </p>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 필터 */}
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setFilter(f.value)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === f.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 검색 */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="닉네임 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              검색
            </button>
          </form>
        </div>
      </div>

      {/* 회원 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="pl-6 pr-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-52">
                회원
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                연령대
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                걷기 횟수
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                총 걷기 시간
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                가입일
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                상태
              </th>
              <th className="pl-4 pr-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  회원이 없습니다.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleOpenDetail(member)}
                >
                  <td className="pl-6 pr-2 py-4">
                    <div className="flex items-center gap-3">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                      <span className={`text-sm font-medium truncate flex-1 text-center ${member.is_blocked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {member.nickname || '(닉네임 없음)'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {member.age_group || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {member.total_walks > 0 ? `${member.total_walks}회` : '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {formatDuration(member.total_duration)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {formatDate(member.created_at)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {renderRoleBadge(member)}
                      {renderStatusBadge(member)}
                    </div>
                  </td>
                  <td className="pl-4 pr-6 py-4">
                    <div className="flex items-center justify-center">
                      {renderActionButton(member)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            {totalPages > 10 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* 회원 상세 모달 */}
      {(selectedMember || isDetailLoading) && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelectedMember(null); setIsDetailLoading(false) }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isDetailLoading && !selectedMember ? (
              <div className="p-12 text-center text-gray-500">로딩 중...</div>
            ) : selectedMember && (
              <>
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">회원 상세 정보</h3>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* 모달 본문 */}
                <div className="p-5 space-y-5">
                  {/* 프로필 정보 */}
                  <div className="flex items-center gap-4">
                    {selectedMember.avatar_url ? (
                      <img
                        src={selectedMember.avatar_url}
                        alt=""
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={28} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-lg font-bold ${selectedMember.is_blocked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {selectedMember.nickname || '(닉네임 없음)'}
                        </h4>
                        {renderRoleBadge(selectedMember)}
                        {renderStatusBadge(selectedMember)}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        연령대: {selectedMember.age_group || '미설정'}
                      </p>
                    </div>
                  </div>

                  {/* 활동 통계 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <FileText size={14} />
                        <span className="text-xs font-medium">게시글</span>
                      </div>
                      <p className="text-xl font-bold text-blue-800">{selectedMember.post_count}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <MessageSquare size={14} />
                        <span className="text-xs font-medium">댓글</span>
                      </div>
                      <p className="text-xl font-bold text-green-800">{selectedMember.comment_count}</p>
                    </div>
                  </div>

                  {/* 상세 정보 */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">걷기 횟수</span>
                      <span className="font-medium text-gray-900">
                        {selectedMember.total_walks > 0 ? `${selectedMember.total_walks}회` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">총 걷기 시간</span>
                      <span className="font-medium text-gray-900">
                        {formatDuration(selectedMember.total_duration)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">가입일</span>
                      <span className="font-medium text-gray-900">
                        {formatDateTime(selectedMember.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">최근 수정일</span>
                      <span className="font-medium text-gray-900">
                        {formatDateTime(selectedMember.updated_at)}
                      </span>
                    </div>
                  </div>

                  {/* 관리 버튼 */}
                  {!isMemberSuperAdmin(selectedMember) && (
                    <div className="space-y-2 pt-1">
                      {/* 1단계: 관리자 권한 + 차단 (글쓰기 제한) */}
                      <div className="flex gap-2">
                        {/* 관리자 권한 버튼 (대표만) */}
                        {isSuperAdmin && (
                          selectedMember.is_admin ? (
                            <button
                              onClick={() => handleToggleAdmin(selectedMember)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <ShieldOff size={16} />
                              관리자 권한 해제
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleAdmin(selectedMember)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                              <Shield size={16} />
                              관리자 임명
                            </button>
                          )
                        )}

                        {/* 차단 버튼 (관리자가 아닌 회원만) */}
                        {!selectedMember.is_admin && !selectedMember.is_banned && (
                          selectedMember.is_blocked ? (
                            <button
                              onClick={() => handleToggleBlock(selectedMember)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border border-green-200 text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                            >
                              <CheckCircle size={16} />
                              차단 해제
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleBlock(selectedMember)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
                            >
                              <Ban size={16} />
                              차단 (글쓰기 제한)
                            </button>
                          )
                        )}
                      </div>

                      {/* 2단계: 강퇴 (로그인 차단) - 관리자가 아닌 회원만 */}
                      {!selectedMember.is_admin && (
                        <div>
                          {selectedMember.is_banned ? (
                            <button
                              onClick={() => handleUnban(selectedMember)}
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border border-green-200 text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                            >
                              <UserCheck size={16} />
                              강퇴 해제 (로그인 허용)
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBan(selectedMember)}
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <UserX size={16} />
                              강퇴 (로그인 차단)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
