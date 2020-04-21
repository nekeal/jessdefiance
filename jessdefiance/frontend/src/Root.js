import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, About, Contact, Article, NotFound, Admin, Login, AdminArticle } from './views';
import tokenInterceptor from "./helpers/tokenInterceptor";
import authInterceptor from "./helpers/authInterceptor";

tokenInterceptor();
authInterceptor();

function Root() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Home/>
        </Route>
        <Route exact path='/articles/:category'>
          <Home/>
        </Route>
        <Route exact path='/about'>
          <About/>
        </Route>
        <Route exact path='/contact'>
          <Contact/>
        </Route>
        <Route exact path='/article/:id'>
          <Article/>
        </Route>
        <Route exact path='/panel'>
          <Admin/>
        </Route>
        <Route exact path='/panel/article/add'>
          <AdminArticle/>
        </Route>
        <Route exact path='/panel/article/:id'>
          <AdminArticle/>
        </Route>
        <Route exact path='/login'>
          <Login/>
        </Route>
        <Route>
          <NotFound/>
        </Route>
      </Switch>
    </Router>
  );
}

export default Root;
