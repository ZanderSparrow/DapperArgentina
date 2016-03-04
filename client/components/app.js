const React = require('react');
const NavBar = require('./NavBar'); 
const LoginBar = require('./LoginBar');
const Users = require('../js/users');
const Auth = require('../js/auth');
const TicketList = require('./TicketList');
const forkUtil = require('../js/fork');

const linksList = [
  {
    name: "Home", url: '/'
  },
  {
    name: "issues", url: '/issues'
  },
  {
    name: "Repos", url: '/repos'
  }, 
  {
    name: "Getting Started", url: '/resources'
  },
  {
    name: "Add Friends", url: '/users'
  }
];


class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      // route: '/',
      isLoggedIn: false,
      userId: null,
      name: null,
      username: null,
      avatar_url: null,
      userRepos: []
    };
  }

  componentWillMount(){
    console.log('component mounted: ', Auth.getUserId());
    if(Auth.isLoggedIn()){
     var userId = Auth.getUserId();
      this.setState({
        userId: userId,
        isLoggedIn: true
      });
      console.log('user id ', userId);
      this.getUserInfo(userId);
    }
  }

    
  
  getForks(username) {
    forkUtil.getForks(function(data) {
      this.setState({
        userRepos: data || []
      });
    }.bind(this), console.error, username);
  }

  getUserInfo(userId){
    // Get the user's information
    var self = this;

    Users.getUserInfo(function(data) {
      self.setState({
        userId: userId,
        name: data.name,
        username: data.username,
        avatar_url: data.avatar_url
      });
      self.getForks(data.username);
      console.log('success callback, data:', data);
    }, function(error) {
      console.error("Problem getting user data!");
    },
    userId);
  }

  // Need to load the info when the user logs in
  // Add userinfo somewhere

  render () {
    var childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { 
        userId: this.state.userId,
        username: this.state.username,
        name: this.state.name,
        avatar_url: this.state.avatar_url,
        userRepos: this.state.userRepos
        // ...this.props 
      });
    });
    return (
    <div className='app-shell grey lighten-2' >
    {this.state.isLoggedIn ? <NavBar links={linksList} /> : <LoginBar /> }
      <div className="row">
        <div className="main container">
          {this.state.isLoggedIn ? childrenWithProps : <TicketList /> }
        </div>
      </div>
    </div>
    );
  }

};
module.exports = App;