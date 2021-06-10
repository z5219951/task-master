import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navigation from './components/Navigation'

function App() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/' component={Home}/>
      </Switch>
    </>
  );
}

export default App;
