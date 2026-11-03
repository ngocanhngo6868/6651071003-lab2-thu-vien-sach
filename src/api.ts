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
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=30&fields=${fields}`
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