import { Link, useParams } from 'react-router-dom'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <main className="mx-auto max-w-3xl p-4">
      <Link to="/" className="text-brand-dark hover:underline">← Quay lại danh sách</Link>
      <h1 className="mt-4 text-2xl font-bold">Chi tiết sách: {id}</h1>
    </main>
  )
}