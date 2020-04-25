import React, {useEffect, useReducer} from 'react';
import { Button, Snackbar } from "@material-ui/core";
import styled from "styled-components";
import {deletePost, getPosts, partialUpdatePost} from "../helpers/postsApi";
import ArticleTileAdmin from "../components/ArticleTileAdmin";
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding-top: 1rem;
  
  .panel-actions {
    display: flex;
    margin-bottom: 1rem;
    
    button {
      margin-right: 1rem;
    }
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
  operationInfo: { open: false },
  confirmationDialog: {
    open: false,
    onConfirm: () => {},
    onDecline: () => {}
  }
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
    case "OPEN_CONFIRMATION_DIALOG":
      const { onConfirm, onDecline } = payload;
      return { ...state, confirmationDialog: { open: true, onConfirm, onDecline } };
    case "CLOSE_CONFIRMATION_DIALOG":
      return { ...state, confirmationDialog: { open: false } }
  }
}

function Admin() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { articles, operationInfo, confirmationDialog } = state;

  const history = useHistory();

  useEffect(() => {
    getPosts({})
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

  const removePostInit = slug => {
    dispatch({ type: "OPEN_CONFIRMATION_DIALOG", payload: { onConfirm: () => removePostConfirm(slug), onDecline: () => {} } })
  };

  const removePostConfirm = slug => {
    deletePost(slug)
      .then(() => {
        dispatch({ type: "DELETE_ARTICLE", payload: slug });
        dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie usunięto post" }})
      })
      .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie udało się usunąć postu" }}))
  };

  return (
    <Container>
      <div className="panel-actions">
        <Button variant="contained" color="primary" onClick={() => history.push("/panel/article/add")}>Dodaj artykuł</Button>
        <Button variant="contained" color="secondary" onClick={() => history.push("/")}>Wróć do strony głównej</Button>
      </div>
      <div className="articles">
        {
          articles.map(article => <ArticleTileAdmin article={article} onDelete={removePostInit} onPublish={publishNow} onUnpublish={unpublish} key={article.slug}/> )
        }
      </div>
      <ConfirmationDialog
        open={confirmationDialog.open}
        onDecline={() => { dispatch({ type: "CLOSE_CONFIRMATION_DIALOG" }); confirmationDialog.onDecline(); }}
        onConfirm={() => { dispatch({ type: "CLOSE_CONFIRMATION_DIALOG" }); confirmationDialog.onConfirm(); }}
      />
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
