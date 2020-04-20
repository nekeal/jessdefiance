import React, {useEffect, useRef, useReducer } from 'react';
import { Controller, useForm } from "react-hook-form";
import Quill from 'quill';
import styled from "styled-components";
import { TextField, Select, InputLabel, MenuItem, FormControlLabel, Checkbox, Button, IconButton, Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import StarIcon from "@material-ui/icons/Star";
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {getPost, addImage, updatePost, addPost} from "../helpers/postsApi";
import { useParams } from 'react-router-dom';
import generateSlug from 'slug';
import ImageDialog from "../components/ImageDialog";

const Container = styled.main`    
  max-width: 1200px;
  margin: 0 auto;
  
  .form {
    margin-top: 2rem;
    display: flex;
    align-items: center;
  }
  
  .form-field {
    display: inline-block;
    margin-right: 2rem;
  }
  
  .form-submit {
    margin-left: auto;
  }
  
  .post-images {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    
    .image {
      margin-left: 1rem;
      width: 10rem;
      height: 8rem;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
      }
      
      .name {
        
      }
      
      .delete-image {
        position: absolute;
        top: 0;
        right: 0;
        background: rgba(255,255,255,0.3);
        padding: 0.5rem;
      }
      
      .set-background-image {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255,255,255,0.3);
        padding: 0.5rem;
      }
    }
    
    .add-image {
      margin-left: 1rem;
    }
    
  }
  

  .editor-container {
    margin-top: 2rem;
  }
      
  .editor {
    .ql-editor {
      font-size: 1rem;
  
      h2 {
        font-family: LemonMilk;
        font-weight: normal;
        margin: 1rem 0;
      }
      
      h3 {
        font-family: LemonMilk;
        font-weight: normal;
        margin: 0.7rem 0;
      }
      
      p {
        font-family: SegoeUI, sans-serif;
        margin: 0.4rem 0;
      }
      
      ol {
        list-style: none;
        counter-reset: counter;
        font: inherit;
      }
      
      ol li {
        counter-increment: counter;
      }
      
      ol li::before {
        display: inline-block;
        content: "#" counter(counter);
        font-family: LemonMilk;
        width: 2rem;
      }
      
      blockquote {
        border: none;
        margin: 0.5rem 0;
        padding-left: 1rem;
        font-style: italic;
        font-size: 1.2rem;
      }
      
      img {
        width: 100%;
        border-radius: 1rem;
        box-shadow: 7px 15px 3px 0px #CBB7B0; 
      }
    }
  }
`;

const initialState = {
  article: {
    images: [],
    tags: []
  },
  imageDialogOpen: false,
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "SET_ARTICLE":
      return { ...state, article: payload };
    case "ADD_IMAGE":
      const { article } = state;
      return { ...state, article: { ...article, images: [ ...article.images, payload ] }, imageDialogOpen: false };
    case "OPEN_IMAGE_DIALOG":
      return { ...state, imageDialogOpen: true };
    case "CLOSE_IMAGE_DIALOG":
      return { ...state, imageDialogOpen: false };
  }
}

function AdminArticle() {
  const { register, handleSubmit, errors, setValue, setError, getValues, control } = useForm();
  const [state, dispatch] = useReducer(reducer, initialState);

  const editor = useRef();
  const { id } = useParams();

  const { article: { images, tags }, imageDialogOpen } = state;

  useEffect(() => {
    editor.current = new Quill("#editor", {
      modules: {
        toolbar: "#toolbar",
        clipboard: {},
      },
      theme: "snow"
    });

    getPost(id)
      .then(article => {
        const { title, category, publishAt, published, content } = article;
        setValue("title", title);
        setValue("category", category);
        setValue("publishAt", publishAt);
        setValue("published", published);
        editor.current.clipboard.dangerouslyPasteHTML(0, content);
        dispatch({ type: "SET_ARTICLE", payload: article });
      });
  }, []);

  const onSubmit = data => {
    const { title, category, publishAt, published } = data;
    const slug = state.article.slug || generateSlug(title);
    const post = {
      title, slug, category, publishAt, published,
      content: editor.current.root.innerHTML,
      images: images.map(image => image.id)
    };

    if(state.article.slug) {
      updatePost(post);
    } else {
      addPost(post);
    }
  };

  const uploadImage = (name, image) => {
    addImage(name, image)
      .then(image => dispatch({ type: "ADD_IMAGE", payload: image }));
  };

  const insertImage = index => {
    const selection = editor.current.getSelection();
    const postIndex = selection ? selection.index : 0;

    editor.current.insertEmbed(postIndex, 'image', images[index].image);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller name="title" defaultValue="" control={control} rules={{ required: "Pole jest wymagane" }} as={
            <TextField
              className="form-field"
              type="text"
              name="title"
              label="Tytuł posta"
              error={!!errors.title}
              helperText={errors.title && errors.title.message}
            />
          } />

          <div className="form-field">
            <InputLabel id="category-label">Kategoria</InputLabel>
            <Controller name="category" defaultValue="NOTES" control={control} rules={{ required: "Pole jest wymagane"}} as={
              <Select labelId="category-label">
                <MenuItem value="NOTES">Notes</MenuItem>
                <MenuItem value="LOOKS">Looks</MenuItem>
                <MenuItem value="DEEPER">Deeper</MenuItem>
              </Select>
            } />
          </div>

          <div className="form-field">
            <Controller name="publishAt" control={control} as={
              <DateTimePicker
                autoOk
                ampm={false}
                label="Czas publikacji"
              />
            }/>
          </div>

          <div className="form-field">
            <FormControlLabel
              control={
                <Checkbox/>
              }
              label="Opublikowany"
            />
          </div>


          <Button className="form-submit" variant="contained" color="primary" type="submit">
            Zapisz zmiany
          </Button>
        </form>
        <div className="post-images">
          Zdjęcia
          {
            images.map((image, index) =>
              <div className="image">
                <img src={image.thumbnail} alt="" onClick={() => insertImage(index)}/>
                <div className="name">{image.title}</div>
                <IconButton className="set-background-image">
                  <StarIcon/>
                </IconButton>
                <IconButton className="delete-image">
                  <DeleteIcon/>
                </IconButton>
              </div>
            )
          }
          <IconButton className="add-image" onClick={() => dispatch({ type: "OPEN_IMAGE_DIALOG" })}>
            <AddIcon/>
          </IconButton>
        </div>
        <div className="editor-container">
          <div className="editor-toolbar" id="toolbar">
            <span className="ql-formats">
              <select className="ql-header" defaultValue="">
                <option value="2"/>
                <option value="3"/>
                <option value=""/>
              </select>
            </span>
            <span className="ql-formats">
              <button className="ql-bold"/>
              <button className="ql-italic"/>
            </span>
            <span className="ql-formats">
              <button className="ql-blockquote"/>
            </span>
            <span className="ql-formats">
              <button className="ql-list" value="ordered"/>
            </span>
            <span className="ql-formats">
              <button className="ql-link"/>
            </span>
            {/*<div className="ql-formats">*/}
            {/*  <button onClick={insertImage}>Image</button>*/}
            {/*</div>*/}
          </div>
          <div className="editor">
            <div id="editor"/>
          </div>
        </div>
      </Container>
      <ImageDialog open={imageDialogOpen} onAdd={uploadImage} onClose={() => dispatch({ type: "CLOSE_IMAGE_DIALOG" })}/>
    </MuiPickersUtilsProvider>
  );
}

export default AdminArticle;
