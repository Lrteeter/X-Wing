var React = require('react'),
    ReactRouter = require('react-router'),
    LinkedStateMixin = require('react-addons-linked-state-mixin'),
    ApiUserUtil = require('../util/api_user_util'),
    ApiGameUtil = require('../util/api_game_util'),
    UserStore = require('../stores/users'),
    GameStore = require('../stores/games'),
    History = require('react-router').History,
    Games = require('./Games');

var GameDetails = React.createClass({
  mixins: [LinkedStateMixin, History],

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
      comments1: "",
      comments2: "",
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
        comments1: game.comments1,
        comments2: game.comments2,
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

  editComments: function() {
    event.preventDefault();
    this.setState({editing: true});
  },

  handleGameUpdate: function(event){
    event.preventDefault();
    var game = {id: parseInt(this.props.gameId), user1: parseInt(this.state.user1.id), user2: parseInt(this.state.user2.id), winner: parseInt(this.state.winner), comments1: this.state.comments1, comments2: this.state.comments2}
    ApiGameUtil.updateGame(game);
    this.setState({editing: undefined});
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

      if (parseInt(this.state.user1.id) === parseInt(this.state.current_user_id)) {
        var innerHtml = this.state.user2.username + "'s Comments: " + this.state.comments2;
        var comments =
          <div>
            <div className="game-comments">My Comments: {this.state.comments1}</div>
            <button title="edit" className="edit-game" id={this.state.gameId} onClick={this.editComments}>edit</button>
            <div className="game-comments">{innerHtml}</div>
          </div>;
        var editComments =
          <form onSubmit={this.handleGameUpdate}>
            <textarea cols="40" rows="5" valueLink={this.linkState("comments1")}></textarea>
            <input className="edit-comments-button" type="submit" value="save"/>
            <div className="game-comments">{innerHtml}</div>
          </form>;
      } else {
        var innerHtml = this.state.user1.username + "'s Comments: " + this.state.comments1;
        var comments =
          <div>
            <div className="game-comments">My Comments: {this.state.comments2}</div>
            <button title="edit" className="edit-game" id={this.state.gameId} onClick={this.editComments}>edit</button>
            <div className="game-comments">{innerHtml}</div>
          </div>;
        var editComments =
          <form onSubmit={this.handleGameUpdate}>
            <textarea cols="40" rows="5" valueLink={this.linkState("comments2")}></textarea>
            <input className="edit-comments-button" type="submit" value="save"/>
            <div className="game-comments">{innerHtml}</div>
          </form>;
      }

      if (!this.state.editing) {
        var commentField = comments;
      } else {
        var commentField = editComments;
      }

      var time = GameStore.dateToString(this.state.created_at);
      return (
        <div className="game-container">
          <h4>{this.state.user1.username} vs. {this.state.user2.username}:</h4>
          <div className="game-winner">Winner: {winner}</div>
          {commentField}<br/>
        </div>
      );
    }
  }
});

module.exports = GameDetails;
