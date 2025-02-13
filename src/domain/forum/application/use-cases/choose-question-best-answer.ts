import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseBestAnswerQuestionUseCaseRequest {
  answerId: string
  authorId: string
}

interface ChooseBestAnswerQuestionUseCaseResponse {
  question: Question
}

export class ChooseBestAnswerQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseBestAnswerQuestionUseCaseRequest): Promise<ChooseBestAnswerQuestionUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      throw new Error('Question not found!')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed!')
    }

    question.bestAnswerId = answer.id

    await this.answersRepository.save(answer)

    return {
      question,
    }
  }
}
