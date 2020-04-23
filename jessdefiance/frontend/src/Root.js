import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, About, Contact, Article, NotFound, Admin, Login, AdminArticle } from './views';
import tokenInterceptor from "./helpers/tokenInterceptor";
import authInterceptor from "./helpers/authInterceptor";
import { createBrowserHistory } from "history";
import {ProtectedRoute} from "./helpers/ProtectedRoute";

const history = createBrowserHistory();
tokenInterceptor(history);
authInterceptor();

function Root() {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/articles/:category' component={Home}/>
        <Route exact path='/about' component={About}/>
        <Route exact path='/contact' component={Contact}/>
        <Route exact path='/article/:id' component={Article}/>
        <ProtectedRoute exact path='/panel' component={Admin}/>
        <ProtectedRoute exact path='/panel/article/add' component={AdminArticle}/>
        <ProtectedRoute exact path='/panel/article/:id' component={AdminArticle}/>
        <Route exact path='/login' component={Login}/>
        <Route component={NotFound}/>
      </Switch>
    </Router>
  );
}

export default Root;
