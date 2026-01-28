'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  Trash2,
  FolderOpen,
  FolderPlus,
  FileAudio,
  Link2,
  Link2Off,
  Play,
  Pause,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react'
import {
  listAudioFiles,
  checkFilesInDb,
  deleteAudioFile,
  uploadAudioFileOnly,
  listAudioFolders,
  createAudioFolder,
  deleteAudioFolder,
} from '@/actions/audioActions'
import type { StorageFileItem } from '@/actions/audioActions'

const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio`
  : ''

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export default function AudioStoragePage() {
  const [folders, setFolders] = useState<string[]>([])
  const [category, setCategory] = useState<string>('')
  const [files, setFiles] = useState<StorageFileItem[]>([])
  const [linkedFiles, setLinkedFiles] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isFoldersLoading, setIsFoldersLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [playingFile, setPlayingFile] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 폴더 생성 상태
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  // 폴더 목록 조회
  const fetchFolders = async () => {
    setIsFoldersLoading(true)
    const result = await listAudioFolders()
    if (result.success) {
      setFolders(result.folders)
      // 첫 번째 폴더를 기본 선택 (폴더가 있고, 아직 선택된 카테고리가 없을 때)
      if (result.folders.length > 0 && !category) {
        setCategory(result.folders[0])
      }
    }
    setIsFoldersLoading(false)
  }

  // 파일 목록 조회
  const fetchFiles = async () => {
    if (!category) return
    setIsLoading(true)
    const result = await listAudioFiles(category)
    if (result.success) {
      setFiles(result.files)

      // DB 연결 상태 확인
      const filenames = result.files.map(f => f.name)
      if (filenames.length > 0) {
        const dbResult = await checkFilesInDb(filenames)
        if (dbResult.success) {
          setLinkedFiles(dbResult.linkedFiles)
        }
      } else {
        setLinkedFiles({})
      }
    } else {
      alert(result.message || '파일 목록 조회에 실패했습니다.')
    }
    setIsLoading(false)
  }

  // 초기 폴더 목록 로드
  useEffect(() => {
    fetchFolders()
  }, [])

  // 카테고리 변경 시 파일 목록 로드
  useEffect(() => {
    if (category) {
      fetchFiles()
    }
    return () => {
      if (audioRef.current) audioRef.current.pause()
      setPlayingFile(null)
    }
  }, [category])

  // 페이지 나갈 때 재생 중지
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause()
    }
  }, [])

  // 폴더 생성
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)
    const result = await createAudioFolder(newFolderName.trim())
    if (result.success) {
      setNewFolderName('')
      setShowNewFolder(false)
      await fetchFolders()
      setCategory(newFolderName.trim())
    } else {
      alert(result.message || '폴더 생성에 실패했습니다.')
    }
    setIsCreatingFolder(false)
  }

  // 폴더 삭제
  const handleDeleteFolder = async () => {
    if (!category) return

    const message = `"${category}" 폴더와 내부의 모든 파일을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    if (!confirm(message)) return

    const result = await deleteAudioFolder(category)
    if (result.success) {
      setCategory('')
      setFiles([])
      setLinkedFiles({})
      await fetchFolders()
    } else {
      alert(result.message || '폴더 삭제에 실패했습니다.')
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|aac|m4a)$/i)) {
      alert('오디오 파일만 업로드할 수 있습니다. (MP3, WAV, OGG, AAC, M4A)')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('파일 크기는 50MB 이하만 가능합니다.')
      return
    }

    setIsUploading(true)
    const result = await uploadAudioFileOnly(file, category)
    if (result.success) {
      await fetchFiles()
    } else {
      alert(result.message || '업로드에 실패했습니다.')
    }
    setIsUploading(false)

    // input 초기화
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (filename: string) => {
    const isLinked = linkedFiles[filename]
    const message = isLinked
      ? `⚠️ 이 파일은 오디오 트랙(DB)에 연결되어 있습니다.\nStorage에서 삭제하면 해당 트랙의 재생이 불가능해집니다.\n\n"${filename}" 파일을 삭제하시겠습니까?`
      : `"${filename}" 파일을 Storage에서 삭제하시겠습니까?`

    if (!confirm(message)) return

    const result = await deleteAudioFile(category, filename)
    if (result.success) {
      await fetchFiles()
    } else {
      alert(result.message || '삭제에 실패했습니다.')
    }
  }

  const handlePlay = (filename: string) => {
    if (playingFile === filename) {
      audioRef.current?.pause()
      setPlayingFile(null)
      return
    }

    if (audioRef.current) audioRef.current.pause()

    const url = `${SUPABASE_STORAGE_URL}/${category}/${filename}`
    const audio = new Audio(url)
    audioRef.current = audio
    audio.play()
    setPlayingFile(filename)

    audio.addEventListener('ended', () => setPlayingFile(null))
    audio.addEventListener('error', () => setPlayingFile(null))
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/audio"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Storage 파일 관리</h1>
            <p className="text-gray-500 mt-1">
              Supabase Storage의 오디오 파일을 직접 관리합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 카테고리 폴더 선택 + 업로드 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {isFoldersLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={14} className="animate-spin" />
                폴더 로딩 중...
              </div>
            ) : folders.length === 0 ? (
              <span className="text-sm text-gray-400">폴더가 없습니다.</span>
            ) : (
              folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setCategory(folder)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    category === folder
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FolderOpen size={14} className="inline mr-1.5 -mt-0.5" />
                  {folder}
                </button>
              ))
            )}

            {/* 새 폴더 생성 버튼 */}
            {showNewFolder ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFolder()
                    if (e.key === 'Escape') { setShowNewFolder(false); setNewFolderName('') }
                  }}
                  placeholder="폴더명 (영문소문자_숫자)"
                  className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
                  autoFocus
                  disabled={isCreatingFolder}
                />
                <button
                  onClick={handleCreateFolder}
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="px-2 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isCreatingFolder ? <Loader2 size={14} className="animate-spin" /> : '생성'}
                </button>
                <button
                  onClick={() => { setShowNewFolder(false); setNewFolderName('') }}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewFolder(true)}
                className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                title="새 폴더 생성"
              >
                <FolderPlus size={14} className="inline mr-1.5 -mt-0.5" />
                새 폴더
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {category && (
              <button
                onClick={handleDeleteFolder}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                title="현재 폴더 삭제"
              >
                <Trash2 size={14} />
                폴더 삭제
              </button>
            )}
            <button
              onClick={() => { fetchFolders(); if (category) fetchFiles() }}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              새로고침
            </button>
            {category && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {isUploading ? '업로드 중...' : '파일 업로드'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a"
                  onChange={handleUpload}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 파일 목록 */}
      {category ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                audio/{category}/ <span className="text-gray-400">({files.length}개 파일)</span>
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Link2 size={12} className="text-green-500" /> DB 연결됨
                </span>
                <span className="flex items-center gap-1">
                  <Link2Off size={12} className="text-gray-400" /> 미연결
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="px-4 py-12 text-center text-gray-500">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              로딩 중...
            </div>
          ) : files.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              <FolderOpen size={32} className="mx-auto mb-2 text-gray-300" />
              <span>이 폴더에 파일이 없습니다.</span>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                    파일명
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase w-[80px]">
                    크기
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase w-[150px]">
                    업로드일
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase w-[70px]">
                    DB
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase w-[100px]">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {files.map((file) => {
                  const isLinked = !!linkedFiles[file.name]
                  const trackId = linkedFiles[file.name]

                  return (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileAudio size={16} className="flex-shrink-0 text-blue-500" />
                          <span className="text-sm text-gray-900 truncate">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-gray-500">
                        {file.metadata?.size ? formatFileSize(file.metadata.size) : '-'}
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-gray-500">
                        {formatDate(file.created_at)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {isLinked ? (
                          <Link
                            href={`/admin/audio/${trackId}`}
                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                            title="연결된 트랙으로 이동"
                          >
                            <Link2 size={14} />
                          </Link>
                        ) : (
                          <span className="text-gray-400" title="DB에 연결된 트랙 없음">
                            <Link2Off size={14} className="mx-auto" />
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handlePlay(file.name)}
                            className={`p-1.5 rounded transition-colors ${
                              playingFile === file.name
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                            }`}
                            title={playingFile === file.name ? '정지' : '미리듣기'}
                          >
                            {playingFile === file.name ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(file.name)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          <FolderOpen size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm">
            {isFoldersLoading
              ? '폴더 목록을 불러오는 중...'
              : folders.length === 0
                ? '폴더가 없습니다. "새 폴더" 버튼으로 폴더를 생성해주세요.'
                : '왼쪽에서 폴더를 선택해주세요.'}
          </p>
        </div>
      )}

      {/* 안내 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-medium mb-1">Storage 파일 관리 안내</p>
        <ul className="list-disc list-inside space-y-0.5 text-amber-700 text-xs">
          <li>여기서 업로드한 파일은 DB(오디오 트랙)에 자동으로 등록되지 않습니다.</li>
          <li>트랙 등록은 <Link href="/admin/audio/add" className="underline hover:text-amber-900">오디오 추가</Link> 페이지에서 해주세요.</li>
          <li>DB에 연결된 파일을 삭제하면 해당 트랙의 재생이 불가능해집니다.</li>
          <li>미연결 파일은 사용되지 않는 파일이므로 정리할 수 있습니다.</li>
          <li>폴더명은 영문 소문자, 숫자, 언더스코어(_)만 사용할 수 있습니다.</li>
          <li>DB에 연결된 트랙이 있는 폴더는 삭제할 수 없습니다.</li>
        </ul>
      </div>
    </div>
  )
}
