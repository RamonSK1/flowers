
export interface MusicTrack {
  id: number
  title: string
  artist: string
  src: string
}

export const playlist: MusicTrack[] = [
  {
    id: 1,
    title: 'Música 01',
    artist: 'Trilha do Oráculo',
    src: '/audio/musica-01.mp3',
  },
  {
    id: 2,
    title: 'Música 02',
    artist: 'Trilha do Oráculo',
    src: '/audio/musica-02.mp3',
  },
  {
    id: 3,
    title: 'Ecci Mundi Gaudium',
    artist: 'Artista não informado',
    src: '/audio/Ecci Mundi Gaudium.mp3',
  },
  {
    id: 4,
    title: 'Salva nos',
    artist: 'Artista não informado',
    src: '/audio/Salva Nos.mp3',
  },
  {
    id: 5,
    title: 'Sangue',
    artist: 'Artista não informado',
    src: '/audio/Sangue.mp3',
  },
]
