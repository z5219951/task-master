import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navigation from './components/Navigation'
import ForgetPass from './pages/ForgetPass';
import VerifyCode from './pages/VerifyCode';
import RePassWord from './pages/RePassWord';
import CheckCode from './pages/CheckCode';

function App() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/forget' exact component={ForgetPass} />
        <Route path='/verify' exact component={VerifyCode} />
        <Route path='/newPass' exact component={RePassWord} />
        <Route path='/checkCode' exact component={CheckCode} />
        <Route path='/home' exact component={Home}/>
      </Switch>
    </>
  );
}

export default App;
