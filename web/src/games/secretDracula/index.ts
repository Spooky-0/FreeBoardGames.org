const Thumbnail = require('./media/thumbnail.png?lqip-colors');
import { GameMode } from 'gamesShared/definitions/mode';
import { IGameDef, IGameStatus } from 'gamesShared/definitions/game';
import instructions from './instructions.md';

export const secretDraculaGameDef: IGameDef = {
  code: 'secretdracula',
  name: 'Secret Dracula',
  imageURL: Thumbnail,
  modes: [{ mode: GameMode.OnlineFriend }],
  minPlayers: 5,
  maxPlayers: 10,
  description: 'A game of decite, lies, and Vampires.',
  descriptionTag: 'Secret Dracula',
  instructions: {
    videoId: 'mbGXIDYdtas',
    text: instructions,
  },
  status: IGameStatus.PUBLISHED,
  config: () => import('./config'),
  aiConfig: () => import('./ai'),
};
