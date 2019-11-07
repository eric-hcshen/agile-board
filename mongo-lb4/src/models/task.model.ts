import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Story, StoryWithRelations } from './story.model';

@model()
export class Task extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    //mongodb: { dataType: 'ObjectID' }
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => Story)
  storyId: string;

  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export interface TaskRelations {
  // describe navigational properties here
  story?: StoryWithRelations;
}

export type TaskWithRelations = Task & TaskRelations;
