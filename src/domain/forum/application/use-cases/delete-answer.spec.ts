import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { MakeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entitites/unique-entity-id'

describe('Delete Answer Use Case', () => {
  let inMemoryAnswerRepository: InMemoryAnswersRepository
  let sut: DeleteAnswerUseCase

  beforeAll(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to delete an answer', async () => {
    const answer = MakeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('123'),
    )

    await inMemoryAnswerRepository.create(answer)

    expect(inMemoryAnswerRepository.items).toHaveLength(1)

    await sut.execute({ authorId: 'author-1', answerId: '123' })

    expect(inMemoryAnswerRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer from another user', async () => {
    const answer = MakeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('123'),
    )

    await inMemoryAnswerRepository.create(answer)

    expect(inMemoryAnswerRepository.items).toHaveLength(1)

    expect(async () => {
      await sut.execute({ answerId: '123', authorId: 'author-2' })
    }).rejects.toBeInstanceOf(Error)
  })
})
