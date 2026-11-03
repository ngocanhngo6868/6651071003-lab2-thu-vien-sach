import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBooks } from '../api'
import booksData from '../data/books.json'
import type { Book } from '../types'
import { truncateText } from '../utils'

const BooksChart = lazy(() => import('../components/BooksChart'))
const initialBooks = booksData as Book[]

export default function ListPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [yearFrom, setYearFrom] = useState<number>(1900)
  const [yearTo, setYearTo] = useState<number>(2026)

  useEffect(() => {
    // Làm mới dữ liệu từ Open Library ở nền; lỗi thì giữ dữ liệu có sẵn
    fetchBooks()
      .then((fresh) => {
        if (fresh.length >= 20) setBooks(fresh)
      })
      .catch(() => {})
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
        <p className="text-sm text-gray-700">
          Hiển thị {filtered.length} / {books.length} sách
        </p>
      </div>

      <Suspense fallback={<div className="mb-6 h-[21rem] rounded-lg border bg-gray-50" aria-hidden="true" />}>
        <BooksChart books={filtered} />
      </Suspense>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b, i) => (
          <li key={b.id} className="rounded-lg border p-4 shadow-sm">
            {b.coverId && (
              <img
                src={`https://covers.openlibrary.org/b/id/${b.coverId}-M.jpg`}
                alt={`Bìa sách ${b.title}`}
                loading={i < 2 ? 'eager' : 'lazy'}
                width={112}
                height={160}
                className="mx-auto mb-3 h-40 w-28 object-contain"
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