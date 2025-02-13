import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { MakeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entitites/unique-entity-id'

describe('Edit Question Use Case', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: EditQuestionUseCase

  beforeAll(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: newQuestion.authorId.toValue(),
      title: 'Title test',
      content: 'Content test',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Title test',
      content: 'Content test',
    })
  })

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {
      return sut.execute({
        questionId: newQuestion.id.toValue(),
        authorId: 'author-2',
        title: 'Title test',
        content: 'Content test',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
