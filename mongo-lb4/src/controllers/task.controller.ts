import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Task} from '../models';
import {TaskRepository} from '../repositories';

export class TaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository : TaskRepository,
  ) {}

  @post('/tasks', {
    responses: {
      '200': {
        description: 'Task model instance',
        content: {'application/json': {schema: getModelSchemaRef(Task)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'NewTask',
            exclude: ['id'],
          }),
        },
      },
    })
    task: Omit<Task, 'id'>,
  ): Promise<Task> {
    return this.taskRepository.create(task);
  }

  @get('/tasks/count', {
    responses: {
      '200': {
        description: 'Task model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Task)) where?: Where<Task>,
  ): Promise<Count> {
    return this.taskRepository.count(where);
  }

  @get('/tasks', {
    responses: {
      '200': {
        description: 'Array of Task model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Task)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Task)) filter?: Filter<Task>,
  ): Promise<Task[]> {
    return this.taskRepository.find(filter);
  }

  @patch('/tasks', {
    responses: {
      '200': {
        description: 'Task PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    task: Task,
    @param.query.object('where', getWhereSchemaFor(Task)) where?: Where<Task>,
  ): Promise<Count> {
    return this.taskRepository.updateAll(task, where);
  }

  @get('/tasks/{id}', {
    responses: {
      '200': {
        description: 'Task model instance',
        content: {'application/json': {schema: getModelSchemaRef(Task)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Task> {
    return this.taskRepository.findById(id);
  }

  @patch('/tasks/{id}', {
    responses: {
      '204': {
        description: 'Task PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    task: Task,
  ): Promise<void> {
    await this.taskRepository.updateById(id, task);
  }

  @put('/tasks/{id}', {
    responses: {
      '204': {
        description: 'Task PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() task: Task,
  ): Promise<void> {
    await this.taskRepository.replaceById(id, task);
  }

  @del('/tasks/{id}', {
    responses: {
      '204': {
        description: 'Task DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.taskRepository.deleteById(id);
  }
}
