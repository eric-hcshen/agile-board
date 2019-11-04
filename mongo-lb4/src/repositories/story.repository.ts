import {DefaultCrudRepository} from '@loopback/repository';
import {Story, StoryRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StoryRepository extends DefaultCrudRepository<
  Story,
  typeof Story.prototype.id,
  StoryRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Story, dataSource);
  }
}
