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
import {Story} from '../models';
import {StoryRepository} from '../repositories';

export class StoryController {
  constructor(
    @repository(StoryRepository)
    public storyRepository : StoryRepository,
  ) {}

  @post('/stories', {
    responses: {
      '200': {
        description: 'Story model instance',
        content: {'application/json': {schema: getModelSchemaRef(Story)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Story, {
            title: 'NewStory',
            exclude: ['id'],
          }),
        },
      },
    })
    story: Omit<Story, 'id'>,
  ): Promise<Story> {
    return this.storyRepository.create(story);
  }

  @get('/stories/count', {
    responses: {
      '200': {
        description: 'Story model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Story)) where?: Where<Story>,
  ): Promise<Count> {
    return this.storyRepository.count(where);
  }

  @get('/stories', {
    responses: {
      '200': {
        description: 'Array of Story model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Story)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Story)) filter?: Filter<Story>,
  ): Promise<Story[]> {
    return this.storyRepository.find(filter);
  }

  @patch('/stories', {
    responses: {
      '200': {
        description: 'Story PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Story, {partial: true}),
        },
      },
    })
    story: Story,
    @param.query.object('where', getWhereSchemaFor(Story)) where?: Where<Story>,
  ): Promise<Count> {
    return this.storyRepository.updateAll(story, where);
  }

  @get('/stories/{id}', {
    responses: {
      '200': {
        description: 'Story model instance',
        content: {'application/json': {schema: getModelSchemaRef(Story)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Story> {
    return this.storyRepository.findById(id);
  }

  @patch('/stories/{id}', {
    responses: {
      '204': {
        description: 'Story PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Story, {partial: true}),
        },
      },
    })
    story: Story,
  ): Promise<void> {
    await this.storyRepository.updateById(id, story);
  }

  @put('/stories/{id}', {
    responses: {
      '204': {
        description: 'Story PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() story: Story,
  ): Promise<void> {
    await this.storyRepository.replaceById(id, story);
  }

  @del('/stories/{id}', {
    responses: {
      '204': {
        description: 'Story DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.storyRepository.deleteById(id);
  }
}
