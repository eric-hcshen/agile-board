import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Task, TaskRelations, Story} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StoryRepository} from './story.repository';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id,
  TaskRelations
> {

  public readonly story: BelongsToAccessor<Story, typeof Task.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('StoryRepository') protected storyRepositoryGetter: Getter<StoryRepository>,
  ) {
    super(Task, dataSource);
    this.story = this.createBelongsToAccessorFor('story', storyRepositoryGetter,);
    this.registerInclusionResolver('story', this.story.inclusionResolver);
  }
}
