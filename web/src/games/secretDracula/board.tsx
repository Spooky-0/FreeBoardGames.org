import * as React from 'react';
import { IGameArgs } from 'gamesShared/definitions/game';
import { GameLayout } from 'gamesShared/components/fbg/GameLayout';
import { Ctx } from 'boardgame.io';

import { IG } from './interfaces';

import { BVampirePolicies } from './components/bvampirepolicy';
import { BPlayer } from './components/bplayer';
import { BHumanPolicies } from './components/bhumanpolicy';
import { BElectionTracker } from './components/belectiontracker';

import { BVote } from './phases/vote/bvote';
import { BEndVote } from './phases/vote/bvoteresults';
import { BDiscard } from './phases/discardVeto/bdiscard';
import { BPeek } from './phases/special/bpeek';
import { BShowPlayer } from './components/bshowplayer';

import css from './board.css';

interface IBoardProps {
  G: IG;
  ctx: Ctx;
  moves: any;
  playerID: string;
  gameArgs?: IGameArgs;
}

export class Board extends React.Component<IBoardProps> {
  render() {
    let playerorder = Array(this.props.ctx.numPlayers).fill(0);
    let deads = Array(this.props.ctx.numPlayers).fill(false);
    let vampires = Array(this.props.ctx.numPlayers).fill(false);
    for (let i = 0; i < this.props.ctx.numPlayers; i++) {
      playerorder[i] = i;
      if (this.props.G.deadIDs.includes(i)) {
        deads[i] = true;
      }
      if (this.props.G.vampireIDs.includes(i)) {
        vampires[i] = true;
      }
    }

    return (
      <div className={css.div}>
        <GameLayout gameArgs={this.props.gameArgs} allowWiderScreen={true}>
          {this.render_players(playerorder, deads, vampires)}

          <BElectionTracker count={this.props.G.electionTracker}></BElectionTracker>

          <BVampirePolicies
            playedPolicies={this.props.G.policyBoardVampire.length}
            playerCount={this.props.ctx.numPlayers}
          ></BVampirePolicies>

          <BHumanPolicies
            playedPolicies={this.props.G.policyBoardHuman.length}
            playerCount={this.props.ctx.numPlayers}
          ></BHumanPolicies>
          {this.render_chosePriest(playerorder, deads, vampires)}

          {this.render_votePriest()}

          {this.render_endVotePriest()}

          {this.render_discardMayor()}

          {this.render_discardPriest()}

          {this.render_vetoMayor()}

          {this.render_peekPolicy()}

          {this.render_investigate1(playerorder, deads, vampires)}

          {this.render_investigate2()}

          {this.render_specialElection(playerorder, deads, vampires)}

          {this.render_execution(playerorder, deads, vampires)}
        </GameLayout>
      </div>
    );
  }
  /*
            { this.props.G.log.map((a) => {
                return(<div>
                       { a }
                  </div>)})}
            <div>
                  <pre id="json">
                   { JSON.stringify(this.props.ctx, null, '\t') }
                  </pre>
            </div>
*/

  render_players(playerorder: number[], deads, vampires) {
    return (
      <>
        {playerorder.map((a) => {
          return (
            <div key={'render_players-' + a.toString}>
              <table>
                <tbody>
                  <tr>
                    <BPlayer
                      me={Number(this.props.playerID) == a}
                      playerName={this.props.gameArgs.players[a].name}
                      playerActive={a in this.props.ctx.activePlayers}
                      dead={deads[a]}
                      vampire={vampires[a]}
                      dracula={this.props.G.draculaID == a}
                      mayor={this.props.G.mayorID == a}
                      priest={this.props.G.priestID == a}
                      chose={() => {
                        return;
                      }}
                    ></BPlayer>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </>
    );
  }

  render_chosePriest(playerorder, deads, vampires) {
    return (
      <>
        {
          // parseInt(this.props.playerID) in this.props.ctx.activePlayers &&
          this.props.ctx.phase == 'phaseChosePriest' ? (
            <div>
              <p> Chose Priest </p>
              {parseInt(this.props.playerID) in this.props.ctx.activePlayers ? (
                <table>
                  <tbody>
                    <tr>
                      {playerorder.map((a) => {
                        return (
                          <>
                            <BPlayer
                              me={Number(this.props.playerID) == a}
                              playerName={this.props.gameArgs.players[a].name}
                              playerActive={false}
                              dead={deads[a]}
                              vampire={vampires[a]}
                              dracula={this.props.G.draculaID == a}
                              mayor={false}
                              priest={false}
                              chose={() => {
                                this.props.moves.moveChosePriest(a, parseInt(this.props.playerID));
                              }}
                            ></BPlayer>
                          </>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }

  render_votePriest() {
    return (
      <>
        {
          //
          this.props.ctx.phase == 'phaseVotePriest' ? (
            <div>
              <p> Vote on Mayor and Priest </p>
              {parseInt(this.props.playerID) in this.props.ctx.activePlayers ? (
                <BVote
                  yes={() => {
                    this.props.moves.moveVoteYes(parseInt(this.props.playerID));
                  }}
                  no={() => {
                    this.props.moves.moveVoteNo(parseInt(this.props.playerID));
                  }}
                ></BVote>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }

  render_endVotePriest() {
    return (
      <>
        {
          //
          this.props.ctx.phase == 'phaseEndVotePriest' ? (
            <div>
              <p> Results of Election </p>
              {parseInt(this.props.playerID) in this.props.ctx.activePlayers ? (
                <BEndVote
                  yes={this.props.G.voteCountYes}
                  no={this.props.G.voteCountNo}
                  done={true}
                  ok={() => {
                    this.props.moves.moveOKVote(parseInt(this.props.playerID));
                  }}
                ></BEndVote>
              ) : (
                <BEndVote
                  yes={this.props.G.voteCountYes}
                  no={this.props.G.voteCountNo}
                  done={false}
                  ok={() => {
                    this.props.moves.moveOKVote(parseInt(this.props.playerID));
                  }}
                ></BEndVote>
              )}
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }

  render_discardMayor() {
    return (
      <>
        {
          // parseInt(this.props.playerID) in this.props.ctx.activePlayers &&
          this.props.ctx.phase == 'phaseDiscardMayor' ? (
            <div>
              <p> Mayor: Discard Card </p>
              <BDiscard
                policies={this.props.G.policyHand}
                vetoEnabled={false}
                mayor={this.props.G.mayorID == parseInt(this.props.playerID)}
                discard={this._discardWrapper(parseInt(this.props.playerID))}
                veto={this._vetoWrapper(parseInt(this.props.playerID))}
              ></BDiscard>
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }
  render_discardPriest() {
    return (
      <>
        {
          // parseInt(this.props.playerID) in this.props.ctx.activePlayers &&
          this.props.ctx.phase == 'phaseDiscardPriest' || this.props.ctx.phase == 'phaseDiscardPriestVeto' ? (
            <div>
              <p> Priest: Discard Card </p>
              <BDiscard
                policies={this.props.G.policyHand.map((a) => {
                  return parseInt(this.props.playerID) in this.props.ctx.activePlayers ? a : null;
                })}
                vetoEnabled={this.props.G.vetoPower}
                mayor={this.props.G.mayorID == parseInt(this.props.playerID)}
                discard={this._discardWrapper(parseInt(this.props.playerID))}
                veto={this._vetoWrapper(parseInt(this.props.playerID))}
              ></BDiscard>
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }
  render_vetoMayor() {
    return (
      <>
        {
          // parseInt(this.props.playerID) in this.props.ctx.activePlayers &&
          this.props.ctx.phase == 'phaseVetoMayor' ? (
            <div>
              <p> Mayor: Agree Veto? </p>
              <BDiscard
                policies={this.props.G.policyHand}
                vetoEnabled={this.props.G.vetoPower}
                mayor={this.props.G.mayorID == parseInt(this.props.playerID)}
                discard={this._discardWrapper(parseInt(this.props.playerID))}
                veto={this._vetoWrapper(parseInt(this.props.playerID))}
              ></BDiscard>
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }
  render_peekPolicy() {
    return (
      <>
        {
          //
          this.props.ctx.phase == 'phasePeekPolicy' ? (
            <div>
              <p> Next Three Samples </p>
              {parseInt(this.props.playerID) in this.props.ctx.activePlayers ? (
                <BPeek
                  policies={this.props.G.policyPeek}
                  ok={() => {
                    this.props.moves.moveOK(parseInt(this.props.playerID));
                  }}
                ></BPeek>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }
  render_investigate1(playerorder, deads, vampires) {
    return (
      <>
        {
          // parseInt(this.props.playerID) in this.props.ctx.activePlayers && this.props.ctx.phase == 'phaseInvestigate1' ? (
          this.props.ctx.phase == 'phaseInvestigate1' ? (
            <div>
              <p> Mayor: Who to Investigate? </p>
              {parseInt(this.props.playerID) in this.props.ctx.activePlayers ? (
                <table>
                  <tbody>
                    <tr>
                      {playerorder.map((a) => {
                        return (
                          <>
                            <BPlayer
                              me={Number(this.props.playerID) == a}
                              playerName={this.props.gameArgs.players[a].name}
                              playerActive={false}
                              dead={deads[a]}
                              vampire={vampires[a]}
                              dracula={this.props.G.draculaID == a}
                              mayor={false}
                              priest={false}
                              chose={() => {
                                this.props.moves.moveInvestigateStart(a, parseInt(this.props.playerID));
                              }}
                            ></BPlayer>
                          </>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }
  render_investigate2() {
    return (
      <>
        {
          // parseInt(this.props.playerID) in this.props.ctx.activePlayers &&
          this.props.ctx.phase == 'phaseInvestigate2' ? (
            <div>
              <p>Finish Investigation</p>
              {parseInt(this.props.playerID) in this.props.ctx.activePlayers ? (
                <BShowPlayer
                  name={
                    this.props.gameArgs.players.map((player) => {
                      return player.name;
                    })[(this.props.G.investigateID, this.props.G.investigateID)]
                  }
                  vampire={this.props.G.investigate == 1}
                  finish={() => {
                    this.props.moves.moveInvestigateEnd(parseInt(this.props.playerID));
                  }}
                  iInvestigate={true}
                ></BShowPlayer>
              ) : (
                <BShowPlayer
                  name={
                    this.props.gameArgs.players.map((player) => {
                      return player.name;
                    })[(this.props.G.investigateID, this.props.G.investigateID)]
                  }
                  vampire={null}
                  finish={() => {
                    return;
                  }}
                  iInvestigate={false}
                ></BShowPlayer>
              )}
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }
  render_specialElection(playerorder, deads, vampires) {
    return (
      <>
        {
          // parseInt(this.props.playerID) in this.props.ctx.activePlayers &&
          this.props.ctx.phase == 'phaseSpecialElection' ? (
            <div>
              <p>Special Election: Chose next Mayor</p>
              {parseInt(this.props.playerID) in this.props.ctx.activePlayers ? (
                <table>
                  <tbody>
                    <tr>
                      {playerorder.map((a) => {
                        return (
                          <>
                            <BPlayer
                              me={Number(this.props.playerID) == a}
                              playerName={this.props.gameArgs.players[a].name}
                              playerActive={false}
                              dead={deads[a]}
                              vampire={vampires[a]}
                              dracula={this.props.G.draculaID == a}
                              mayor={false}
                              priest={false}
                              chose={() => {
                                this.props.moves.movePickMayor(a, parseInt(this.props.playerID));
                              }}
                            ></BPlayer>
                          </>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }
  render_execution(playerorder, deads, vampires) {
    return (
      <>
        {
          // parseInt(this.props.playerID) in this.props.ctx.activePlayers &&
          this.props.ctx.phase == 'phaseExecution' ? (
            <div>
              <p>Mayor: Execute player </p>
              {parseInt(this.props.playerID) in this.props.ctx.activePlayers ? (
                <table>
                  <tbody>
                    <tr>
                      {playerorder.map((a) => {
                        return (
                          <>
                            <BPlayer
                              me={Number(this.props.playerID) == a}
                              playerName={this.props.gameArgs.players[a].name}
                              playerActive={false}
                              dead={deads[a]}
                              vampire={vampires[a]}
                              dracula={this.props.G.draculaID == a}
                              mayor={false}
                              priest={false}
                              chose={() => {
                                this.props.moves.moveExecute(a, parseInt(this.props.playerID));
                              }}
                            ></BPlayer>
                          </>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )
        }
      </>
    );
  }
  _discardWrapper(playerIndex: number) {
    if (this.props.ctx.phase == 'phaseDiscardMayor') {
      return (index: number) => {
        return this.props.moves.moveDiscardMayor(index, playerIndex);
      };
    }
    if (this.props.ctx.phase == 'phaseDiscardPriest') {
      return (index: number) => {
        return this.props.moves.moveDiscardPriest(index, playerIndex);
      };
    }
    if (this.props.ctx.phase == 'phaseDiscardPriestVeto') {
      return (index: number) => {
        return this.props.moves.moveDiscardPriest(index, playerIndex);
      };
    }

    return (index: number) => {
      // gotta trick the linter, but at the same time this function needs this signature...
      if (index == 1) {
        return;
      }
      return;
    };
  }

  _vetoWrapper(playerIndex: number) {
    if (this.props.ctx.phase == 'phaseDiscardPriestVeto') {
      return () => {
        return this.props.moves.moveWantVetoPriest(playerIndex);
      };
    }
    if (this.props.ctx.phase == 'phaseDiscardMayor') {
      return (want: boolean) => {
        return this.props.moves.moveWantVetoPriest(want, playerIndex);
      };
    }
    return () => {
      return;
    };
  }
}
