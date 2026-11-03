import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Book } from '../types'

interface Props {
  books: Book[]
}

export default function BooksChart({ books }: Props) {
  const counts = new Map<number, number>()
  for (const b of books) {
    if (b.year === null) continue
    const decade = Math.floor(b.year / 10) * 10
    counts.set(decade, (counts.get(decade) ?? 0) + 1)
  }
  const data = [...counts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([decade, total]) => ({ decade: `${decade}s`, total }))

  if (data.length === 0) {
    return <p className="text-sm text-gray-700">Không có dữ liệu để vẽ biểu đồ.</p>
  }

  return (
    <section aria-label="Biểu đồ số sách theo thập kỷ" className="mb-6 rounded-lg border p-4">
      <h2 className="mb-2 text-lg font-semibold text-brand-dark">Số sách theo thập kỷ</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="decade" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" name="Số sách" fill="#059669" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}