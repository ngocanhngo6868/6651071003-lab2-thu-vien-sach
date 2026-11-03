import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBooks } from '../api'
import type { Book } from '../types'
import { truncateText } from '../utils'

const BooksChart = lazy(() => import('../components/BooksChart'))

export default function ListPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [yearFrom, setYearFrom] = useState<number>(1900)
  const [yearTo, setYearTo] = useState<number>(2026)

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = books.filter(
    (b) => b.year !== null && b.year >= yearFrom && b.year <= yearTo,
  )

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Thư viện sách</h1>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <label className="flex flex-col text-sm font-medium text-gray-800">
          Từ năm
          <input
            type="number"
            min={1000}
            max={2026}
            value={yearFrom}
            onChange={(e) => setYearFrom(Number(e.target.value))}
            className="mt-1 w-28 rounded border border-gray-400 px-2 py-1"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-800">
          Đến năm
          <input
            type="number"
            min={1000}
            max={2026}
            value={yearTo}
            onChange={(e) => setYearTo(Number(e.target.value))}
            className="mt-1 w-28 rounded border border-gray-400 px-2 py-1"
          />
        </label>
        {!loading && !error && (
          <p className="text-sm text-gray-700">
            Hiển thị {filtered.length} / {books.length} sách
          </p>
        )}
      </div>

      {loading && <p className="text-gray-800">Đang tải...</p>}
      {error && <p className="text-red-700">{error}</p>}

      {!loading && !error && (
        <>
          <Suspense fallback={<p className="mb-6 text-sm text-gray-700">Đang tải biểu đồ...</p>}>
            <BooksChart books={filtered} />
          </Suspense>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b, i) => (
              <li key={b.id} className="rounded-lg border p-4 shadow-sm">
                {b.coverId && (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${b.coverId}-S.jpg`}
                    alt={`Bìa sách ${b.title}`}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    width={200}
                    height={192}
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
        </>
      )}
    </main>
  )
}