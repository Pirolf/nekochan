require('../../spec_helper');

describe('TechApi', () => {
  let subject, Game, game, gameUUID, mongoose, TechTree;
  beforeEach.async(async () => {
    MockPromise.uninstall();
    subject = require('../../../server/api/tech_api');
    Game = require('../../../server/models/game');
    TechTree = require('../../../server/tech_tree');
    mongoose = require('mongoose');

    mongoose.Promise = require('es6-promise').Promise;
    await (new Promise((resolve, reject) => {
      mongoose.connect('mongodb://localhost:28017/nekochan-test', resolve);
    }));

    gameUUID = require('uuid').v4();
  });
  
  describe('#research', () => {
    describe('when prereqs are not met', () => {
      describe('when not all prereqs have been developed', () => {
        beforeEach.async(async () => {
          spyOn(TechTree, 'get').and.returnValue({
            fishing: {
              prereqs: {
                somePreReq: {level: 3},
                otherPreReq: {level: 0}
              }
            }
          });

          game = await Game.create({
            users: ['abc123'],
            uuid: gameUUID,
            tech: {somePreReq: {level:3}}
          });
        });

        it.async('rejects', async () => {
          let err;
          try { 
            await subject.research(gameUUID, {name: 'fishing'});
          } catch (e) {
            err = e; 
          }
          expect(err).toEqual('research prereqs not met');
        });
      });
    });
    
    describe('when resources are not met', () => {
      beforeEach.async(async () => {
        spyOn(TechTree, 'get').and.returnValue({
          fishing: {
            resources: {
              salmon: 5
            }
          }
        });

        game = await Game.create({
          users: ['abc123'],
          uuid: gameUUID,
          resources: {}
        });
      });

      it.async('rejects', async () => {
        let err;
        try { 
          await subject.research(gameUUID, {name: 'fishing'});
        } catch (e) {
          err = e; 
        }
        expect(err).toEqual('not enough resources');
      });
    });

    describe('when both prereqs and resources are met', () => {
      describe('when researching a new tech', () => {
        beforeEach.async(async () => {
          spyOn(TechTree, 'get').and.returnValue({
            fishing: {
              resources: {salmon: 5},
              prereqs: {
                somePreReq: {level: 3}
              }
            }
          });

          game = await Game.create({
            users: ['abc123'],
            uuid: gameUUID,
            resources: {catfish: 3, salmon: 6},
            tech: {somePreReq: {level: 4}}
          });
        });

        it.async('resolves with the updated game', async() => {
          const result = await subject.research(gameUUID, {name: 'fishing'}); 
          expect(result).toEqual(jasmine.objectContaining({
            resources: jasmine.objectContaining({catfish: 3, salmon: 1}),
            tech: jasmine.objectContaining({
              somePreReq: {level:4},
              fishing: {level: 0}
            })
          }));
        });
      });
      
      describe('when upgrading a tech', () => {
        beforeEach.async(async () => {
          spyOn(TechTree, 'get').and.returnValue({
            fishing: {
              resources: {salmon: 5},
              prereqs: {
                somePreReq: {level: 3}
              }
            }
          });

          game = await Game.create({
            users: ['abc123'],
            uuid: gameUUID,
            resources: {salmon: 6},
            tech: {somePreReq: {level:4}}
          });
        });
				
				it.async('upgrades the tech by 1 level', async () => {
				});
      });
    });
  });
});
