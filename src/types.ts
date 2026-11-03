export interface Book {
  id: string
  title: string
  author: string
  year: number | null
  pages: number | null
  coverId: number | null
  subjects: string[]
}