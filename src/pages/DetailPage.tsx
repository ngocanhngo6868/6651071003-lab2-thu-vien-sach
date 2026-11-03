import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchBookDetail } from '../api'
import type { BookDetail } from '../api'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<BookDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchBookDetail(id)
      .then(setBook)
      .catch((e: Error) => setError(e.message))
  }, [id])

  return (
    <main className="mx-auto max-w-3xl p-4">
      <Link to="/" className="text-brand-dark hover:underline">
        ← Quay lại danh sách
      </Link>
      {error && <p className="mt-4 text-red-700">{error}</p>}
      {!book && !error && <p className="mt-4">Đang tải...</p>}
      {book && (
        <article className="mt-4">
          <h1 className="mb-4 text-2xl font-bold text-brand-dark">{book.title}</h1>
          {book.coverId && (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`}
              alt={`Bìa sách ${book.title}`}
              className="mb-4 max-h-96 object-contain"
            />
          )}
          <p className="mb-4 whitespace-pre-line text-gray-800">{book.description}</p>
          {book.subjects.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {book.subjects.map((s) => (
                <li key={s} className="rounded-full bg-brand-light px-3 py-1 text-sm text-gray-900">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </article>
      )}
    </main>
  )
}