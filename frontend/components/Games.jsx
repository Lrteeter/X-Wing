var React = require('react'),
    ReactRouter = require('react-router'),
    LinkedStateMixin = require('react-addons-linked-state-mixin'),
    GameStore = require('../stores/games'),
    History = require('react-router').History,
    GameDetails = require('./GameDetails'),
    ApiGameUtil = require('../util/api_game_util');

var LinkedStateRadioGroupMixin = {
  radioGroup: function(key) {
    return {
      valueLink: function(value) {
        return {
          value : this.state[key] == value,
          requestChange: function() {
            var s = {};
            s[key] = value;
            this.setState(s)
          }.bind(this)
        }
      }.bind(this)
    }
  }
};

var Games = React.createClass({
      mixins: [LinkedStateRadioGroupMixin, LinkedStateMixin, History],

  blankInt: {
    user2: "",
    comments: ""
  },

  getStateFromStore: function () {
    var current_user_id = parseInt(this.props.currentUser.id);
    return ({
      games: GameStore.allMyGames(current_user_id),
      user1: current_user_id
    })
  },

  getInitialState: function () {
    return this.getStateFromStore();
  },

  componentDidMount: function () {
    this.gameListener = GameStore.addListener(this._gameChanged);
    ApiGameUtil.fetchGames();
  },

  componentWillUnmount: function () {
    this.gameListener.remove();
  },

  _gameChanged: function () {
    this.setState(this.getStateFromStore());
  },

  handleGameSubmit: function(event){
    event.preventDefault();
    var game = {user1: this.props.currentUser.id, user2: parseInt(this.state.user2), winner: parseInt(this.state.winner), comments: this.state.comments}
    // this.state.games.push(game);
    ApiGameUtil.createGame(game);
    // this.setState(this.blankInt);
  },

  removeGame: function(event){
    event.preventDefault();
    var game = GameStore.find(parseInt(event.target.id));
    if (this.state.gameDetails === parseInt(event.target.id)) {
      this.state.gameDetails = undefined;
    }
    ApiGameUtil.deleteGame(game);
  },

  showGame: function(event){
    event.preventDefault();
    this.setState({gameDetails: parseInt(event.currentTarget.id)})
  },

  unshowGame: function(event){
    event.preventDefault();
    this.setState({gameDetails: undefined});
  },

  render: function () {
    if (!this.state.games) {
      return <div></div>
    } else {

      var gamesContainer = [];
      this.state.games.forEach(function(game) {
        gamesContainer.push(
          <li className="game-item" key={game.id}>
            <button title="delete" className="remove-game" id={game.id} onClick={this.removeGame}>X</button>
            <a className="game-show" onClick={this.showGame} id={game.id}>{GameStore.dateToString(game.created_at)}</a>
          </li>
        )
      }.bind(this))

      if (this.state.gameDetails) {
        var detailsClassName = "game-details";
      } else {
        var detailsClassName = "game-details-hidden";
      }

      var winner = this.radioGroup("winner");

      return (
        <div className="game-form">

          <h3>My old games</h3>
          <ul className="game-list">
            {gamesContainer}
          </ul>

          <div className={detailsClassName}>
            <GameDetails key={this.state.gameDetails} gameId={this.state.gameDetails} currentUserId={this.state.user1}/>
            <button onClick={this.unshowGame}>Close</button>
          </div>

          <h3>Enter a new game</h3>
          <form onSubmit={this.handleGameSubmit}>
            <label>Opponent :</label>
            <input type="text" valueLink={this.linkState("user2")}/><br/>
            <label>Did you win? </label>
            <br/>
            <input type="radio" checkedLink={winner.valueLink(this.state.user1)}/>
            <label>Yes</label>
            <br/>
            <input type="radio" checkedLink={winner.valueLink(false)}/>
            <label>No</label>
            <br/>
            <label>Comments : </label>
            <textarea cols="40" rows="5" valueLink={this.linkState("comments")}></textarea>
            <input className="new-game-button" type="submit" value="Add Game"/>
          </form>
        </div>
      );
    }
  }

})

module.exports = Games;
