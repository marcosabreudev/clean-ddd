import { MakeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityId } from '@/core/entitites/unique-entity-id'

describe('Delete Question Use Case', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question by id', async () => {
    const newQuestion = MakeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('123'),
    )
    const newQuestion2 = MakeQuestion(
      { authorId: new UniqueEntityId('author-2') },
      new UniqueEntityId('321'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)
    await inMemoryQuestionsRepository.create(newQuestion2)

    expect(inMemoryQuestionsRepository.items).toHaveLength(2)

    await sut.execute({ questionId: '123', authorId: 'author-1' })

    expect(inMemoryQuestionsRepository.items).toHaveLength(1)
  })

  it('should not be able to delete a question from another author', async () => {
    const newQuestion = MakeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('123'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(async () => {
      await sut.execute({ questionId: '123', authorId: 'author-2' })
    }).rejects.toBeInstanceOf(Error)
  })
})
