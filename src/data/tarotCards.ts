
export interface TarotCardData {
  id: number
  name: string
  numeral: string
  meaning: string
  message: string
  image: string
}

export const tarotCards: TarotCardData[] = [
  {
    id: 1,
    name: 'A Torre',
    numeral: 'XVI',
    meaning: 'Consequências',
    message: 'Algumas escolhas abalam aquilo que parecia seguro.',
    image: '/imagens/tarot/tower.webp',
  },
  {
    id: 2,
    name: 'Cinco de Copas',
    numeral: 'V',
    meaning: 'Arrependimento',
    message: 'Reconhecer o que foi perdido também é reconhecer o próprio erro.',
    image: '/imagens/tarot/five-of-cups.webp',
  },
  {
    id: 3,
    name: 'O Eremita',
    numeral: 'IX',
    meaning: 'Reflexão',
    message: 'O silêncio pode ser um espaço para compreender e aprender.',
    image: '/imagens/tarot/hermit.webp',
  },
  {
    id: 4,
    name: 'A Justiça',
    numeral: 'XI',
    meaning: 'Responsabilidade',
    message: 'Um pedido sincero começa quando assumimos nossas escolhas.',
    image: '/imagens/tarot/justice.webp',
  },
  {
    id: 5,
    name: 'A Temperança',
    numeral: 'XIV',
    meaning: 'Mudança',
    message: 'A mudança verdadeira exige tempo, cuidado e atitudes.',
    image: '/imagens/tarot/temperance.webp',
  },
  {
    id: 6,
    name: 'A Estrela',
    numeral: 'XVII',
    meaning: 'Esperança',
    message: 'Ainda é possível desejar coisas boas, sem exigir um novo começo.',
    image: '/imagens/tarot/star.webp',
  },
]
