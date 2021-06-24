import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navigation from './components/Navigation'
import Taskboard from './pages/Taskboard'

function App() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/' component={Taskboard}/>
      </Switch>
    </>
  );
}

export default App;
