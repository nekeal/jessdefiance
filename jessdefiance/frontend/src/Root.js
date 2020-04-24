import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, About, Contact, Article, NotFound, Admin, Login, AdminArticle } from './views';
import tokenInterceptor from "./helpers/tokenInterceptor";
import authInterceptor from "./helpers/authInterceptor";
import { createBrowserHistory } from "history";
import {ProtectedRoute} from "./helpers/ProtectedRoute";
import styled from 'styled-components';
import {colors, fonts} from "./helpers/styles";

const history = createBrowserHistory();
tokenInterceptor(history);
authInterceptor();

const Container = styled.div`
  font-family: ${fonts.primaryFont};
  color: ${colors.textColor};
`;

function Root() {
  return (
    <Container>
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
    </Container>
  );
}

export default Root;
