import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Story,
  Task,
} from '../models';
import { StoryRepository } from '../repositories';

export class StoryTaskController {
  constructor(
    @repository(StoryRepository) protected storyRepository: StoryRepository,
  ) { }

  @get('/stories/{id}/tasks', {
    responses: {
      '200': {
        description: 'Array of Task\'s belonging to Story',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Task) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Task>,
  ): Promise<Task[]> {
    return this.storyRepository.tasks(id).find(filter);
  }

  @post('/stories/{id}/tasks', {
    responses: {
      '200': {
        description: 'Story model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Task) } },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Story.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'NewTaskInStory',
            exclude: ['id'],
            optional: ['storyId']
          }),
        },
      },
    }) task: Omit<Task, 'id'>,
  ): Promise<Task> {
    return this.storyRepository.tasks(id).create(task);
  }

  @patch('/stories/{id}/tasks', {
    responses: {
      '200': {
        description: 'Story.Task PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, { partial: true }),
        },
      },
    })
    task: Partial<Task>,
    @param.query.object('where', getWhereSchemaFor(Task)) where?: Where<Task>,
  ): Promise<Count> {
    return this.storyRepository.tasks(id).patch(task, where);
  }

  @del('/stories/{id}/tasks', {
    responses: {
      '200': {
        description: 'Story.Task DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Task)) where?: Where<Task>,
  ): Promise<Count> {
    return this.storyRepository.tasks(id).delete(where);
  }
}
