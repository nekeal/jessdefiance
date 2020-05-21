import React, {useEffect, useReducer} from 'react';
import { Button, Snackbar, FormControlLabel, Switch, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import styled from "styled-components";
import {adminGetPosts, deletePost, getPosts, partialUpdatePost} from "../helpers/postsApi";
import ArticleTileAdmin from "../components/ArticleTileAdmin";
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Pagination } from '@material-ui/lab';

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding-top: 1rem;
  
  .panel-actions {
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
    
    button {
      margin-right: 1rem;
    }
  }
  
  .articles {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  
  .sort-select {
    width: 8rem;
    margin-left: 0.5rem;
  }
  
  .MuiPagination-root {
    margin-left: 1rem;
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
  },
  listView: false,
  ordering: "-publish_at",
  loading: true,
  pagination: {
    page: 0,
    limit: 30,
    count: 0
  }
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "SET_ARTICLES":
      return { ...state, articles: payload.articles, pagination: { ...state.pagination, count: payload.count }, loading: false };
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
      return { ...state, confirmationDialog: { open: false } };
    case "SWITCH_LIST_VIEW":
      return { ...state, listView: !state.listView };
    case "CHANGE_SORT_MODE":
      return { ...state, ordering: payload, pagination: { ...state.pagination, page: 0 }, loading: true };
    case "CHANGE_PAGE":
      return { ...state, pagination: { ...state.pagination, page: payload }, loading: true };
    case "CHANGE_LIMIT":
      return { ...state, pagination: { ...state.pagination, page: 0, limit: payload } };
    default:
      return { ...state };
  }
}

function Admin() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { articles, operationInfo, confirmationDialog, listView, ordering, pagination, loading } = state;

  const history = useHistory();

  useEffect(() => {
    adminGetPosts({ limit: pagination.limit, offset: pagination.limit * pagination.page }, ordering)
      .then(response => dispatch({ type: "SET_ARTICLES", payload: response }));
  }, [ pagination.page, pagination.limit, ordering ]);

  const publishNow = slug =>
    partialUpdatePost(slug, { publish_at: (new Date()).toISOString(), published: true })
      .then(post => {
        dispatch({ type: "UPDATE_ARTICLE", payload: post });
        dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie opublikowano post" }});
      })
      .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie udało się opublikować postu" }}));

  const unpublish = slug =>
    partialUpdatePost(slug, { published: false })
      .then(post => {
        dispatch({ type: "UPDATE_ARTICLE", payload: post });
        dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie cofnięto publikację postu" }});
      })
      .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie udało się cofnąć publikacji postu" }}));

  const changeOrdering = ordering => dispatch({ type: "CHANGE_SORT_MODE", payload: ordering });

  const changePage = page => dispatch({ type: "CHANGE_PAGE", payload: page });

  const changeLimit = limit => dispatch({ type: "CHANGE_LIMIT", payload: limit });

  const removePostInit = slug => dispatch({ type: "OPEN_CONFIRMATION_DIALOG", payload: { onConfirm: () => removePostConfirm(slug), onDecline: () => {} } });

  const removePostConfirm = slug =>
    deletePost(slug)
      .then(() => {
        dispatch({ type: "DELETE_ARTICLE", payload: slug });
        dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie usunięto post" }})
      })
      .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie udało się usunąć postu" }}));

  return (
    <Container>
      <div className="panel-actions">
        <Button variant="contained" color="primary" onClick={() => history.push("/panel/article/add")}>Dodaj artykuł</Button>
        <Button variant="contained" color="secondary" onClick={() => history.push("/")}>Wróć do strony głównej</Button>
        <FormControlLabel
          control={<Switch checked={listView} onChange={() => dispatch({ type: "SWITCH_LIST_VIEW"})} name="listView" />}
          label="Widok listy"
        />

        <FormControl className="sort-select">
          <InputLabel id="sortByLabel">Sortuj po</InputLabel>
          <Select
            labelId="sortByLabel"
            id="sortBy"
            value={ordering}
            onChange={e => changeOrdering(e.target.value)}
          >
            <MenuItem value="title">Nazwa A-Z</MenuItem>
            <MenuItem value="-title">Nazwa Z-A</MenuItem>
            <MenuItem value="-publish_at">Data publikacji od najnowszej</MenuItem>
            <MenuItem value="publish_at">Data publikacji od najstarszej</MenuItem>
            <MenuItem value="-created_at">Data dodania od najnowszej</MenuItem>
            <MenuItem value="created_at">Data dodania od najstarszej</MenuItem>
          </Select>
        </FormControl>

        <FormControl className="sort-select">
          <InputLabel id="paginateByLabel">Paginuj co</InputLabel>
          <Select
            labelId="paginateByLabel"
            id="paginateBy"
            value={pagination.limit}
            onChange={e => changeLimit(e.target.value)}
          >
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={45}>45</MenuItem>
          </Select>
        </FormControl>

        <Pagination page={pagination.page + 1} count={Math.ceil(pagination.count / pagination.limit)} onChange={(e, value) => changePage(value - 1)}/>

      </div>
      <div className="articles">
        {
          loading
            ? <div>Ładowanie artykułów...</div>
            : articles.map(article => <ArticleTileAdmin article={article} onDelete={removePostInit} onPublish={publishNow} onUnpublish={unpublish} key={article.slug} listView={listView}/> )
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
