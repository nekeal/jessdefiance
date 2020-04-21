import React, {useEffect, useReducer} from 'react';
import { Button, Snackbar } from "@material-ui/core";
import styled from "styled-components";
import {deletePost, getPosts, partialUpdatePost} from "../helpers/postsApi";
import ArticleTileAdmin from "../components/ArticleTileAdmin";
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 1rem;
  
  .article-add {
      margin-bottom: 1rem;
  }
  
  .articles {
    display: flex;
    flex-wrap: wrap;
  }
`;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const initialState = {
  articles: [],
  operationInfo: { open: false }
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "SET_ARTICLES":
      return { ...state, articles: payload }
    case "UPDATE_ARTICLE":
      return { ...state, articles: state.articles.map(article => article.slug === payload.slug ? { ...article, published: payload.published, publishAt: payload.publishAt  } : article) };
    case "DELETE_ARTICLE":
      return { ...state, articles: state.articles.filter(article => article.slug !== payload) };
    case "SET_OPERATION_INFO":
      return { ...state, operationInfo: { open: true, ...payload } };
    case "DELETE_OPERATION_INFO":
      return { ...state, operationInfo: { open: false } };
  }
}

function Admin() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { articles, operationInfo } = state;

  const history = useHistory();

  useEffect(() => {
    getPosts()
      .then(articles => dispatch({ type: "SET_ARTICLES", payload: articles }));
  }, []);

  const publishNow = slug => {
    partialUpdatePost(slug, { publish_at: (new Date()).toISOString(), published: true })
      .then(post => {
        dispatch({ type: "UPDATE_ARTICLE", payload: post });
        dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie opublikowano post" }});
      })
      .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie udało się opublikować postu" }}))
  };

  const unpublish = slug => {
    partialUpdatePost(slug, { published: false })
      .then(post => {
        dispatch({ type: "UPDATE_ARTICLE", payload: post });
        dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie cofnięto publikację postu" }});
      })
      .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie udało się cofnąć publikacji postu" }}))

  };

  const removePost = slug => {
    deletePost(slug)
      .then(() => {
        dispatch({ type: "DELETE_ARTICLE", payload: slug });
        dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie usunięto post" }})
      })
      .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie udało się usunąć postu" }}))
  };

  return (
    <Container>
      <Button variant="contained" color="primary" className="article-add" onClick={() => history.push("/panel/article/add")}>Dodaj artykuł</Button>
      <div className="articles">
        {
          articles.map(article => <ArticleTileAdmin article={article} onDelete={removePost} onPublish={publishNow} onUnpublish={unpublish} key={article.slug}/> )
        }
      </div>
      <Snackbar
        open={operationInfo.open}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: "DELETE_OPERATION_INFO" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => dispatch({ type: "DELETE_OPERATION_INFO" })}
          severity={operationInfo.type}
        >
          { operationInfo.message }
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Admin;
