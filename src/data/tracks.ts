import type { Track } from '../types/track'

export const tracks: Track[] = [
  {
    id: 1,
    title: "The Night We Met",
    artist: "Lord Huron",
    genre: ["Indie Folk", "Indie Rock"],
    cover: "/assets/images/night-we-met.jpg",
    rating: 9.4,
    duration: "3:28",
    album: "Strange Trails",
    releaseDate: "2015-05-07",
    description: "Лирическая композиция о сожалении и желании вернуться в прошлое, чтобы изменить потерянные отношения."
  },
  {
    id: 2,
    title: "Bring Me to Life",
    artist: "Evanescence",
    genre: ["Alternative Metal", "Nu Metal", "Gothic Rock"],
    cover: "/assets/images/bring-me-to-life.jpg",
    rating: 9.1,
    duration: "3:56",
    album: "Fallen",
    releaseDate: "2003-05-22",
    description: "Один из самых известных хитов Evanescence о духовном пробуждении и возвращении к жизни после эмоциональной пустоты."
  },
  {
    id: 3,
    title: "My Disaster",
    artist: "Seether",
    genre: ["Hard Rock", "Alternative Metal"],
    cover: "/assets/images/my-disaster.jpg",
    rating: 9.7,
    duration: "4:32",
    album: "Isolate And Medicate (Deluxe Edition)",
    releaseDate: "2014-07-01",
    description: "Мрачная баллада о разрушительных отношениях, где любовь переплетается с болью."
  },
  {
    id: 4,
    title: "Whispers in the Dark",
    artist: "Skillet",
    genre: ["Christian Rock", "Alternative Metal"],
    cover: "/assets/images/whispers-in-the-dark.jpg",
    rating: 8.9,
    duration: "3:24",
    album: "Comatose",
    releaseDate: "2006-10-03",
    description: "Динамичный трек о надежде и внутренней поддержке даже в самые тёмные моменты жизни."
  },
  {
    id: 5,
    title: "Courtesy Call",
    artist: "Thousand Foot Krutch",
    genre: ["Alternative Rock", "Rap Rock"],
    cover: "/assets/images/courtesy-call.jpg",
    rating: 9.0,
    duration: "3:56",
    album: "The End Is Where We Begin",
    releaseDate: "2012-05-17",
    description: "Энергичная композиция с мощным мотивирующим посылом о решимости, уверенности и готовности действовать."
  }

]