var Store = require('flux/utils').Store,
    Constants = require('../constants/constants'),
    UserStore = require('./users'),
    ApiGameUtil = require('../util/api_game_util'),
    AppDispatcher = require('../dispatcher/dispatcher');

var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var GameStore = new Store(AppDispatcher);
var _games = {};

var resetGames = function(games){
  _games = {};
  games.forEach(function (game) {
    _games[game.id] = game;
  });
};

var resetGame = function (game) {
  _games[game.id] = game;
};

var removeGame = function () {
  var games = [];
  ApiGameUtil.fetchGames();
  games = GameStore.allGames();
};

GameStore.allGames = function () {
  var games = [];
  for (var id in _games) {
    games.push(_games[id]) ;
  }
  return games;
};

GameStore.allMyGames = function (user_id) {
  var games = [];
  for (var id in _games) {
    if (_games[id].user1 === user_id || _games[id].user2 === user_id) {
      games.push(_games[id]) ;
    }
  }
  return games;
};

GameStore.find = function (id) {
  return _games[id];
};

GameStore.dateToString = function(date){
  var timestamp = new Date(date);
  return (MONTHS[timestamp.getMonth()]+ " " + timestamp.getDate())
};

GameStore.__onDispatch = function (payload) {
  switch(payload.actionType) {
    case Constants.GAMES_RECEIVED:
      resetGames(payload.games);
      break;
    case Constants.GAME_RECEIVED:
      resetGame(payload.game);
      break;
    case Constants.GAME_REMOVED:
      removeGame(payload.game);
      break;
  }
  GameStore.__emitChange();
};

module.exports = GameStore;
