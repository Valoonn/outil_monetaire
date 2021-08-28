import './App.css';
import Navbar from './component/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from './page/Login';
import Register from './page/Register';
import Home from './page/Home';
import CurencyConverter from './page/CurencyConverter';

function App() {

  return (
    <Router>
      <div className="page">
        <Navbar />
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/curency_converter" component={CurencyConverter} />
            <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </Router>
  );
}
  
export default App;
