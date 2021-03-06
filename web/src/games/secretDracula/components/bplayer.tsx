import React from 'react';
import css from './bplayer.css';

interface InnerWrapper {
  me: boolean;

  playerName: string;
  playerActive: boolean;

  dead: boolean;
  vampire: boolean;
  dracula: boolean;

  mayor: boolean;
  priest: boolean;

  chose(): any;
}

export class BPlayer extends React.Component<InnerWrapper, {}> {
  hashCode = function (s) {
    let a = s.split('').reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    if (a < 0) {
      return -a;
    }
    return a;
  };

  render() {
    let my_rand_id = this.hashCode(this.props.playerName);

    return (
      <>
        <span
          onClick={() => {
            this.props.chose();
          }}
        >
          <td>
            <p>{this.props.playerActive ? '🕒 ' : ' '}</p>
          </td>
          <td>
            <p>
              {this.props.dead
                ? this.deads[my_rand_id % this.deads.length]
                : this.props.vampire
                ? this.vampires[my_rand_id % this.vampires.length]
                : this.humans[my_rand_id % this.humans.length]}
            </p>
          </td>
          <td>
            {this.props.vampire && !this.props.dracula ? (
              <div className={css.vampire}> {this.props.playerName} </div>
            ) : this.props.dracula ? (
              <div className={css.dracula}> {this.props.playerName} </div>
            ) : (
              <div> {this.props.playerName} </div>
            )}
          </td>
          <td>
            <p>{this.props.priest ? '✝️' : ' '}</p>
          </td>
          <td>
            <p>{this.props.mayor ? '🏅' : ' '}</p>
          </td>
        </span>
      </>
    );
  }

  vampires = ['🧛', '🧛🏽‍♂️', '🧛🏽‍♀️', '🧛🏽', '🧛🏿', '🧛🏻‍♂️', '🧛🏻', '🧛🏼', '🧛🏼‍♀️', '🧛🏼‍♂️', '🧛🏾‍♀️'];
  humans = [
    '👩‍🎓',
    '👨‍🏫',
    '🧑‍🌾',
    '👩‍⚖️',
    '🧑‍🔧',
    '👩‍🍳',
    '🧑‍🏭',
    '🧑‍💼',
    '👩‍🔬',
    '🧑‍🎤',
    '👨‍✈️',
    '👩‍🚀',
    '👩‍🚒',
    '👮',
    '👷',
    '👳‍♀️',
  ];
  deads = ['⚰️', '💀', '☠', '👻', '⚱', '🪦'];
}
