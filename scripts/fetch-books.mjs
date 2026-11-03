import { mkdirSync, writeFileSync } from 'node:fs'

const fields = 'key,title,author_name,first_publish_year,number_of_pages_median,cover_i,subject'
const url = `https://openlibrary.org/search.json?q=programming&limit=40&fields=${fields}`

const res = await fetch(url)
if (!res.ok) throw new Error(`Loi API: ${res.status}`)
const data = await res.json()

const books = data.docs
  .filter((d) => d.first_publish_year && d.cover_i)
  .slice(0, 30)
  .map((d) => ({
    id: d.key.replace('/works/', ''),
    title: d.title,
    author: d.author_name?.[0] ?? 'Không rõ tác giả',
    year: d.first_publish_year,
    pages: d.number_of_pages_median ?? null,
    coverId: d.cover_i,
    subjects: (d.subject ?? []).slice(0, 3),
  }))

mkdirSync('src/data', { recursive: true })
writeFileSync('src/data/books.json', JSON.stringify(books, null, 2))
console.log(`Da luu ${books.length} sach vao src/data/books.json`)