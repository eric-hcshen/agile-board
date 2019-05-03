---
layout: post
title: Building an Online Game With LoopBack 4 (Part 3)
date: 2019-05-03
author: Wenbo Sun
permalink: /strongblog/building-an-online-game-with-loopback-4-pt3/
categories:
  - How-To
  - LoopBack
published: false  
---

## Part 3: Customizing APIs in Controller

### Introduction

"Ready to build amazing things?" asks the LoopBack 4 homepage before encouraging you to try the open source framework.

"Try LoopBack 4 now."

In this series, I'm going to do exactly that! Join me as I create an API web game using LoopBack 4.

The main purpose of this series is to help you learn LoopBack 4 and how to use it to easily build your own API and web project. We'll do so by creating a new project I'm working on: an online web text-based adventure game. In this game, you can create your own account to build characters, fight monsters and find treasures. You will be able to control your character to take a variety of actions: attacking enemies, casting spells, and getting loot. This game should also allow multiple players to log in and play with their friends.

### Previously on Building an Online Game With LoopBack 4

In the last episode, we used a third-party library to generate UUID and built relations between `character`, `weapon`, `aromr`, and `skill`.

Here are the previous episodes:

* [Part 1: Building a Simple LoopBack Project With MongoDB](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/)
* [Part 2: Generating Universally Unique ID and Managing Models Relationships](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt2/)


<!--more-->

### In this episode

We already have some simply APIs in our project. They are all default CRUD(Create, Read, Update, and Delete) APIs that auto-generated by LoopBack 4. In this episode. we will create our own APIs to achieve following functions for character updating:

![models](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/models.png)
* The ability for users to equip their character with weapon, armor, and skill. This function should also be able to allow users to change weapon, armor, and skill for their character. In any cases, we should update `defence` and `attack` accordingly.
* The ability for users to unequip their character. We also need to update `defence` and `attack`.
* The ability to levelup a character when it get enough experience. We should update `currentExp`, `nextLevelExp`, `level`, `maxHealth`, `currentHealth`, `maxMana`, `currentMana`, `attack`, and `defence`.
* The ability to check character's `weapon`, `aromr`, and `skill` information.

### Create controller

First, let's create a controller for updating character. Run `lb4 controller` in your project root.

```
wenbo:firstgame wenbo$ lb4 controller
? Controller class name: UpdateCharacter
? What kind of controller would you like to generate? REST Controller with CRUD functions
? What is the name of the model to use with this CRUD repository? Character
? What is the name of your CRUD repository? CharacterRepository
? What is the type of your ID? string
? What is the base HTTP path name of the CRUD operations? /updatecharacter
   create src/controllers/update-character.controller.ts
   update src/controllers/index.ts

Controller UpdateCharacter was created in src/controllers/
```

Open `/src/controllers/update-character.controller.ts`. Add following imports. This controller is
associated with `Armor`, `Weapon`, `skill` as well.

```ts
import {Armor, Weapon, Skill} from '../models';
import {WeaponRepository, ArmorRepository, SkillRepository } from '../repositories';
```

And add following line into constructor:

```ts
constructor(
  @repository(CharacterRepository)
  public characterRepository : CharacterRepository,

  //add following lines
  @repository(WeaponRepository)
  public weaponRepository : CharacterRepository,
  @repository(ArmorRepository)
  public armorRepository : CharacterRepository,
  @repository(SkillRepository)
  public skillRepository : CharacterRepository,
) {}

```

This will connect this controller with `Armor`, `Weapon`, and `skill`. Delete all those default APIs since we don't need them anymore.


### Equip Character

The first API we need is `@patch '/updatecharacter/{id}/weapon'`. This API's job is equip character a weapon and unequip the old weapon if there is one.

Here is code for this API:

```ts
@patch('/updatecharacter/{id}/weapon', {
  responses: {
    '200': {
      description: 'update weapon',
      content: {'application/json': {schema: Weapon}},
    },
  },
})
async updateWeapon(
  @param.path.string('id') id: string,
  @requestBody() weapon: Weapon,
): Promise<Weapon> {
  //equip new weapon
  let char: Character = await this.characterRepository.findById(id);
  char.attack! += weapon.attack;
  char.defence! += weapon.defence;

  //unequip old weapon
  let filter: Filter = {where:{"characterId":id}};
  if((await this.weaponRepository.find(filter))[0] != undefined){
    let oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
    char.attack! -= oldWeapon.attack!;
    char.defence! -= oldWeapon.defence!;
    await this.characterRepository.weapon(id).delete();
  }
  await this.characterRepository.updateById(id, char);
  return await this.characterRepository.weapon(id).create(weapon);
}
```

Let's go over it line by line.

```ts
async updateWeapon(
  @param.path.string('id') id: string,
  @requestBody() weapon: Weapon,
): Promise<Weapon> {

  ...
```
This is the function signature. It means this API expect to get character ID from URL and weapon entity from body.