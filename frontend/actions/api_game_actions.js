var AppDispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants');

var ApiGameUtil = {

  receiveGames: function(games) {
    AppDispatcher.dispatch({
      actionType: Constants.GAMES_RECEIVED,
      games: games
    });
  },

  receiveGame: function(game) {
    AppDispatcher.dispatch({
      actionType: Constants.GAME_RECEIVED,
      game: game
    });
  },

  removeGame: function(game) {
    AppDispatcher.dispatch({
      actionType: Constants.GAME_REMOVED,
      game: game
    });
  }
}

module.exports = ApiGameUtil;
