var React = require('react'),
    ReactRouter = require('react-router'),
    Games = require('./Games'),
    ApiUserUtil = require('../util/api_user_util'),
    ApiGameUtil = require('../util/api_game_util'),
    UserStore = require('../stores/users'),
    GameStore = require('../stores/users'),
    History = require('react-router').History;

function _getStateFromStore() {
  var current_user = UserStore.currentUser();
  return ({
    current_user: current_user,
    users: UserStore.all(),
  })
}

var User = React.createClass({
  mixins: [History],

  getInitialState: function () {
    return _getStateFromStore();
  },

  _usersChanged: function() {
    this.setState(_getStateFromStore());
  },

  componentDidMount: function() {
    this.usersListener = UserStore.addListener(this._usersChanged);
    this.gamesListener = GameStore.addListener(this._usersChanged);
    ApiGameUtil.fetchGames();
    ApiUserUtil.fetchUsers();
    ApiUserUtil.fetchCurrentUser();
  },

  componentWillUnmount: function() {
    this.usersListener.remove();
    this.gamesListener.remove();
  },

  showDetail: function (event) {
    var current_user = this.state.current_user;
    var user = UserStore.find(parseInt(event.target.id));
    this.history.pushState(current_user, '/user/' + user.id)
  },

  render: function () {
    return (
      <div>
        <div>Hello {this.state.current_user.username}</div>
        <Games currentUser={this.state.current_user} className="games-container"/>
      </div>
    );
  }
});

module.exports = User;
