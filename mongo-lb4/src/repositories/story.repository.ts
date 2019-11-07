import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Story, StoryRelations, Task} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TaskRepository} from './task.repository';

export class StoryRepository extends DefaultCrudRepository<
  Story,
  typeof Story.prototype.id,
  StoryRelations
> {

  public readonly tasks: HasManyRepositoryFactory<Task, typeof Story.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>,
  ) {
    super(Story, dataSource);
    this.tasks = this.createHasManyRepositoryFactoryFor('tasks', taskRepositoryGetter,);
    this.registerInclusionResolver('tasks', this.tasks.inclusionResolver);
  }
}
