import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBooks } from '../api'
import type { Book } from '../types'
import { truncateText } from '../utils'

export default function ListPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-8">Đang tải...</p>
  if (error) return <p className="p-8 text-red-700">{error}</p>

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Thư viện sách</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b) => (
          <li key={b.id} className="rounded-lg border p-4 shadow-sm">
            {b.coverId && (
              <img
                src={`https://covers.openlibrary.org/b/id/${b.coverId}-M.jpg`}
                alt={`Bìa sách ${b.title}`}
                className="mb-3 h-48 w-full object-contain"
              />
            )}
            <Link to={`/item/${b.id}`} className="font-semibold text-brand-dark hover:underline">
              {truncateText(b.title, 60)}
            </Link>
            <p className="text-sm text-gray-700">{b.author}</p>
            <p className="text-sm text-gray-700">{b.year ?? 'Chưa rõ năm'}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}