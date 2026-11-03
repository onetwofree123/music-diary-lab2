export interface DiaryMemory {
  place: string
  description: string
  photo?: string
}

export interface DiaryEntry {
  id: number
  trackTitle: string
  artist: string
  dateHeard: string
  rating: number
  emotion: string
  notes: string
  memory?: DiaryMemory
}
