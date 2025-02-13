import { faker } from '@faker-js/faker'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityId } from '@/core/entitites/unique-entity-id'

export function MakeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}
