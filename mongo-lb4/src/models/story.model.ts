import { Entity, model, property, hasMany } from '@loopback/repository';
import { Task, TaskWithRelations } from './task.model';

export interface MyObj { name: string, num: number };

@model()
export class Story extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    //mongodb: { dataType: 'ObjectID' }
  })
  id?: string;

  @property({
    type: 'string',
  })
  strValue?: string;

  @property({
    type: 'number',
  })
  numValue?: number;

  @property({
    type: 'date',
    required: true,
  })
  dateValue: string;

  @property({
    type: 'object',
  })
  objValue?: MyObj;

  @property({
    type: 'array',
    itemType: 'object',
  })
  objArray?: MyObj[];

  @hasMany(() => Task)
  tasks: Task[];

  constructor(data?: Partial<Story>) {
    super(data);
  }
}

export interface StoryRelations {
  // describe navigational properties here
  tasks?: TaskWithRelations;
}

export type StoryWithRelations = Story & StoryRelations;
