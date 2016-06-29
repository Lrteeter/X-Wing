var ReactRouter = require('react-router'),
    ReactDOM = require('react-dom'),
    React = require('react'),
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    Games = require('./components/Games'),
    User = require('./components/User'),
    IndexRoute = ReactRouter.IndexRoute;

var App = React.createClass({

  render: function() {
    return (
      <div className="router">
        <header></header>
        {this.props.children}
      </div>
    );
  }
});

var routes = (
  <Route path="/" component={App}>
    <IndexRoute component={User}/>
    <Route path="games/:id" component={Games}/>
  </Route>
);

document.addEventListener("DOMContentLoaded", function () {
  var root = document.getElementById("root");
  ReactDOM.render(<Router>{routes}</Router>, root);
});
