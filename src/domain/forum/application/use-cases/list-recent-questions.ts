import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'

interface ListRecentQuestionsUseCaseParams extends PaginationParams {}

interface ListRecentQuestionsUseCaseResponse {
  questions: Question[]
}

export class ListRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: ListRecentQuestionsUseCaseParams): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    if (!questions) {
      throw new Error("Can't find any question")
    }

    return {
      questions,
    }
  }
}
