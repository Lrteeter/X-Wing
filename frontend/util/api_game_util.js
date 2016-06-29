var ApiGameActions = require('../actions/api_game_actions');

var ApiGameUtil = {
  fetchGames: function(){
    $.ajax({
      url: "api/games",
      success: function (games) {
        ApiGameActions.receiveGames(games);
      },
      error: function(game) {
        console.log(game);
      }
    })
  },

  createGame: function (game, callback) {
    $.ajax({
      url: "api/games/",
      type: "POST",
      data: {game: game},
      success: function (game) {
        ApiGameActions.receiveGame(game);
        callback && callback(game);
      },
      error: function (game) {
        console.log(game);
      }
    });
  },

  updateGame: function (game, callback) {
    $.ajax({
      url: "api/games/" + game.id,
      type: "PATCH",
      data: {game: game},
      success: function (game) {
        ApiGameActions.receiveGame(game);
        callback && callback(game.id);
      },
      error: function (game) {
        console.log(game);
      }
    });
  },

  deleteGame: function (game) {
    $.ajax({
      url: "api/games/" + game.id,
      type: "DELETE",
      success: function () {
        ApiGameActions.removeGame();
      },
      error: function (game) {
        console.log(game);
      }
    });
  }

};

module.exports = ApiGameUtil;
