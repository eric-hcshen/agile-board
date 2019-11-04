import { Entity, model, property } from '@loopback/repository';

export interface MyObj { name: string, num: number };

@model()
export class Story extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: { dataType: 'ObjectID' }
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


  constructor(data?: Partial<Story>) {
    super(data);
  }
}

export interface StoryRelations {
  // describe navigational properties here
}

export type StoryWithRelations = Story & StoryRelations;
