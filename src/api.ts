import type { Book } from './types'

interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  number_of_pages_median?: number
  cover_i?: number
  subject?: string[]
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[]
}

export async function fetchBooks(query: string = 'programming'): Promise<Book[]> {
  const fields = 'key,title,author_name,first_publish_year,number_of_pages_median,cover_i,subject'
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=24&fields=${fields}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Không tải được dữ liệu')
  const data: OpenLibraryResponse = await res.json()
  return data.docs.map((d) => ({
    id: d.key.replace('/works/', ''),
    title: d.title,
    author: d.author_name?.[0] ?? 'Không rõ tác giả',
    year: d.first_publish_year ?? null,
    pages: d.number_of_pages_median ?? null,
    coverId: d.cover_i ?? null,
    subjects: (d.subject ?? []).slice(0, 3),
  }))
}
interface WorkDetail {
  title: string
  description?: string | { value: string }
  subjects?: string[]
  covers?: number[]
}

export interface BookDetail {
  title: string
  description: string
  subjects: string[]
  coverId: number | null
}

export async function fetchBookDetail(id: string): Promise<BookDetail> {
  const res = await fetch(`https://openlibrary.org/works/${id}.json`)
  if (!res.ok) throw new Error('Không tải được chi tiết sách')
  const d: WorkDetail = await res.json()
  const desc = typeof d.description === 'string' ? d.description : d.description?.value
  return {
    title: d.title,
    description: desc ?? 'Chưa có mô tả cho sách này.',
    subjects: (d.subjects ?? []).slice(0, 8),
    coverId: d.covers?.[0] ?? null,
  }
}