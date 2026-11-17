
export interface QuizOption {
  id: number
  text: string
  correct: boolean
}

export const quizOptions: QuizOption[] = [
  { id: 1, text: 'bocó', correct: true },
  { id: 2, text: 'oxente', correct: false },
  { id: 3, text: 'esse trem vei', correct: true },
  { id: 4, text: 'vixe maria', correct: false },
  { id: 5, text: 'isplode', correct: true },
  { id: 6, text: 'tá doido', correct: false },
]
