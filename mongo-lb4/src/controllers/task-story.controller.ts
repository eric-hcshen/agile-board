import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Task,
  Story,
} from '../models';
import { TaskRepository } from '../repositories';

export class TaskStoryController {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
  ) { }

  @get('/tasks/{id}/story', {
    responses: {
      '200': {
        description: 'Story belonging to Task',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Story) },
          },
        },
      },
    },
  })
  async getStory(
    @param.path.string('id') id: typeof Task.prototype.id,
  ): Promise<Story> {
    return this.taskRepository.story(id);
  }
}
