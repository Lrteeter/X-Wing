var React = require('react'),
    ReactRouter = require('react-router'),
    ApiUserUtil = require('../util/api_user_util'),
    ApiGameUtil = require('../util/api_game_util'),
    UserStore = require('../stores/users'),
    GameStore = require('../stores/games'),
    History = require('react-router').History,
    Games = require('./Games');

var GameDetails = React.createClass({
  mixins: [History],

  getStateFromStore: function() {
    return GameStore.find(parseInt(this.props.gameId));
  },

  getInitialState: function () {
    var current_user_id = this.props.currentUserId;
    return ({
      current_user_id: current_user_id,
      gameId: "",
      user1: "",
      user2: "",
      winner: "",
      created_at: "",
      comments: ""
    })
  },

  componentWillReceiveProps: function (newProps) {
    if (newProps.gameId) {
      var game = GameStore.find(parseInt(newProps.gameId));
      this.setState({
        gameId: parseInt(newProps.gameId),
        user1: UserStore.find(parseInt(game.user1)),
        user2: UserStore.find(parseInt(game.user2)),
        winner: game.winner,
        comments: game.comments,
        created_at: game.created_at
      })
    }
  },

  _gamesChanged: function() {
    this.setState({game: this.getStateFromStore()});
  },

  componentDidMount: function() {
    this.gamesListener = GameStore.addListener(this._gamesChanged);
    this.userListener = UserStore.addListener(this._gamesChanged);
    ApiGameUtil.fetchGames();
    ApiUserUtil.fetchUsers();
  },

  componentWillUnmount: function() {
    this.gamesListener.remove();
    this.userListener.remove();
  },

  render: function () {
    if (!this.state.gameId) {
      return (<div></div>)
    } else {
      var winner;
      if (this.state.winner) {
        winner = this.state.user1
      } else {
        winner = this.state.user2
      }
      if (parseInt(winner.id) === parseInt(this.state.current_user_id)) {
        winner = "me"
      } else {
        winner = winner.username
      }
      var time = GameStore.dateToString(this.state.created_at);
      return (
        <div className="game-container">
          <h4>{this.state.user1.username} vs. {this.state.user2.username}:</h4>
          <div className="game-winner">Winner: {winner}</div>
          <div className="game-comments">Comments: {this.state.comments}</div><br/>
        </div>
      );
    }
  }
});

module.exports = GameDetails;
