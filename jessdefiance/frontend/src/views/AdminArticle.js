import React, { useEffect, useRef, useReducer } from 'react';
import { Controller, useForm } from "react-hook-form";
import Quill from 'quill';
import styled from "styled-components";
import {
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Snackbar
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import StarIcon from "@material-ui/icons/Star";
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getPost, addImage, deleteImage, updatePost, addPost, getTags, addTag, deleteTag } from "../helpers/postsApi";
import { useParams } from 'react-router-dom';
import generateSlug from 'slug';
import ImageDialog from "../components/ImageDialog";
import TagDialog from "../components/TagDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import c from 'classnames';
import MuiAlert from "@material-ui/lab/Alert/Alert";
import {mixins} from "../helpers/styles";

const Container = styled.main`    
  max-width: 1200px;
  margin: 0 auto;
  
  .form-line {
    margin-top: 2rem;
    display: flex;
    align-items: center;
  }
  
  .form-field {
    display: inline-block;
    margin-right: 2rem;
   
    .MuiInputBase-root, .MuiFormControl-root {
      width: 100%;
    }
  }
  
  .form-submit {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
  
  .post-images {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    
    .image {
      margin-left: 1rem;
      width: 10rem;
      height: 8rem;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
      }
      
      .name { 
        position: absolute;
        bottom: 0;
        transform: translateY(100%);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      
      .delete-image {
        position: absolute;
        top: 0;
        right: 0;
        background: rgba(255,255,255,0.6);
        color: black;
        padding: 0.5rem;
      }
    
      .set-background-image {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255,255,255,0.6);
        color: black;
        padding: 0.5rem;
        
        &.background-image {
          color: #832232;
        } 
      }
    }
    
    .add-image {
      margin-left: 1rem;
    }
    
  }
  
  .tag {
    font-family: LemonMilk;
    font-size: 1.2rem;
    border-radius: 1.5rem;
    margin-left: 0.7rem;
    padding: 0.3rem 0.7rem;
    color: #3C3C3C;
    background-color: #F3DFD9;
    cursor: pointer;
    display: flex;
    align-items: center;
      
    &.selected-tag {
      color: #F3DFD9;      
      background-color: #3C3C3C;
    }
    
    .delete-tag {
      padding: 0;
      margin-left: 0.5rem;
    }
  }
  

  .editor-container {
        margin: 2rem 0 6rem;
  }
      
  .editor {
    .ql-editor {
      font-size: 1rem;
      ${mixins.articleContent};
    }
  }
`;

const initialState = {
  article: {
    images: [],
    tags: []
  },
  allTags: [],
  imageDialogOpen: false,
  tagDialogOpen: false,
  operationInfo: { open: false },
};

function reducer(state, action) {
  const { type, payload } = action;
  const { article, allTags } = state;
  let newImages;
  let newTags;

  switch (type) {
    case "SET_ARTICLE":
      return { ...state, article: payload };
    case "ADD_IMAGE_START":
      return { ...state, article: { ...article, images: [ ...article.images, { name: payload } ] }, imageDialogOpen: false };
    case "ADD_IMAGE_END":
      newImages = article.images.map(image => image.name === payload.name ? payload : image);
      return { ...state, article: { ...article, images: newImages } };
    case "REMOVE_IMAGE":
      newImages = article.images.filter(image => image.id !== payload);
      return { ...state, article: { ...article, images: newImages } };
    case "SET_BACKGROUND_IMAGE":
      return { ...state };
    case "OPEN_IMAGE_DIALOG":
      return { ...state, imageDialogOpen: true };
    case "CLOSE_IMAGE_DIALOG":
      return { ...state, imageDialogOpen: false };
    case "SET_TAGS":
      return { ...state, allTags: payload };
    case "ADD_TAG":
      return { ...state, allTags: [ ...allTags, payload ], tagDialogOpen: false };
    case "DELETE_TAG":
      newTags = allTags.filter(tag => tag.id !== payload);
      return { ...state, allTags: newTags };
    case "ADD_TAG_TO_POST":
      return { ...state, article: { ...article, tags: [ ...article.tags, payload ] } };
    case "DELETE_TAG_FROM_POST":
      newTags = article.tags.filter(tag => tag !== payload);
      return { ...state, article: { ...article, tags: newTags } };
    case "OPEN_TAG_DIALOG":
      return { ...state, tagDialogOpen: true };
    case "CLOSE_TAG_DIALOG":
      return { ...state, tagDialogOpen: false };
    case "SET_OPERATION_INFO":
      return { ...state, operationInfo: { open: true, ...payload } };
    case "DELETE_OPERATION_INFO":
      return { ...state, operationInfo: { open: false } };
  }
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AdminArticle() {
  const { register, handleSubmit, errors, setValue, setError, getValues, control } = useForm();
  const [state, dispatch] = useReducer(reducer, initialState);

  const editor = useRef();
  const { id } = useParams();
  const values = getValues();

  const { article: { images, tags }, allTags, imageDialogOpen, tagDialogOpen, operationInfo } = state;

  useEffect(() => {
    register({ name: "backgroundImage"});
    getTags()
      .then(tags => dispatch({ type: "SET_TAGS", payload: tags }));
  }, []);

  useEffect(() => {
    editor.current = new Quill("#editor", {
      modules: {
        toolbar: "#toolbar",
        clipboard: {},
      },
      theme: "snow"
    });

    setValue("publishAt", (new Date()).toISOString());

    if(id) {
      getPost(id)
        .then(article => {
          const { title, subtitle, category, publishAt, published, content, backgroundImage, tags } = article;
          setValue("title", title);
          setValue("subtitle", subtitle || "");
          setValue("category", category);
          setValue("publishAt", publishAt);
          setValue("published", published);
          setValue("backgroundImage", backgroundImage);
          editor.current.clipboard.dangerouslyPasteHTML(0, content);
          dispatch({ type: "SET_ARTICLE", payload: { ...article, tags: tags.map(tag => tag.id) } });
        });
    }
  }, [id]);

  const onSubmit = data => {
    const { title, subtitle, category, publishAt, published, backgroundImage } = data;
    const slug = state.article.slug || generateSlug(title);
    const post = {
      title, subtitle, slug, category, publishAt, published, backgroundImage,
      content: editor.current.root.innerHTML,
      images: images.map(image => image.id),
      tags
    };

    if(state.article.slug) {
      updatePost(post)
        .then(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie zapisano zmiany" } }))
        .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Wystąpił błąd przy zapisywaniu zmian"  } }));
    } else {
      addPost(post)
        .then(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie dodano post" } }))
        .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Wystąpił błąd przy dodawaniu posta"  } }))
    }
  };

  const uploadImage = (name, image) => {
    dispatch({ type: "ADD_IMAGE_START", payload: name });
    addImage(name, image)
      .then(imageObj => dispatch({ type: "ADD_IMAGE_END", payload: imageObj }));
  };

  const removeImage = id => {
    // prevent from deleting image which is in article
    deleteImage(id)
      .then(response => dispatch({ type: "REMOVE_IMAGE", payload: id }));
  };

  const setBackgroundImage = id => {
    setValue("backgroundImage", id);
    dispatch({ type: "SET_BACKGROUND_IMAGE" });
  };

  const insertImage = index => {
    const selection = editor.current.getSelection();
    const postIndex = selection ? selection.index : 0;

    editor.current.insertEmbed(postIndex, 'image', images[index].image);
  };

  const uploadTag = name => {
    addTag(name)
      .then(tagObj => dispatch({ type: "ADD_TAG", payload: tagObj }));
  };

  const removeTag = id => {
    deleteTag(id)
      .then(response => dispatch({ type: "DELETE_TAG", payload: id }));
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-line">
            <Controller name="title" defaultValue="" control={control} rules={{ required: "Pole jest wymagane" }} as={
              <TextField
                className="form-field"
                type="text"
                name="title"
                style={{width: "20%"}}
                label="Tytuł posta"
                error={!!errors.title}
                helperText={errors.title && errors.title.message}
              />
            } />

            <div className="form-field" style={{width: "7%"}}>
              <InputLabel id="category-label" className="MuiInputLabel-shrink">Kategoria</InputLabel>
              <Controller name="category" defaultValue="NOTES" control={control} rules={{ required: "Pole jest wymagane"}} as={
                <Select labelId="category-label">
                  <MenuItem value="FASHION">Fashion</MenuItem>
                  <MenuItem value="TRENDS">Trends</MenuItem>
                  <MenuItem value="DEEPER">Deeper</MenuItem>
                </Select>
              } />
            </div>

            <div className="form-field" style={{width: "17.5%"}}>
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
                  <Checkbox inputRef={register} name="published"/>
                }
                label="Opublikowany"
              />
            </div>

            <div className="form-submit">
              <Button variant="contained" color="primary" type="submit">
                Zapisz zmiany
              </Button>
            </div>

          </div>
          <div className="form-line">
            <Controller name="subtitle" defaultValue="" control={control} as={
              <TextField
                className="form-field"
                style={{width: "50%"}}
                type="text"
                name="subtitle"
                label="Podtytuł"
                error={!!errors.subtitle}
                helperText={errors.subtitle && errors.subtitle.message}
              />
            } />
          </div>

        </form>

        <div className="post-images">
          Zdjęcia
          {
            images.map((image, index) =>
              image.image ?
                <div className="image" key={index}>
                  <img src={image.thumbnail} alt="" onClick={() => insertImage(index)}/>
                  <div className="name">{image.name}</div>
                  <IconButton className={c("set-background-image", {"background-image": values.backgroundImage === image.id})} onClick={() => setBackgroundImage(image.id)}>
                    <StarIcon/>
                  </IconButton>
                  {
                    values && values.backgroundImage !== image.id &&
                    <IconButton className="delete-image" onClick={() => removeImage(image.id)}>
                      <DeleteIcon/>
                    </IconButton>
                  }
                </div> :
                <div className="image" key={index}><CircularProgress /></div>
            )
          }
          <IconButton className="add-image" onClick={() => dispatch({ type: "OPEN_IMAGE_DIALOG" })}>
            <AddIcon/>
          </IconButton>
        </div>
        <div className="post-images">
          Tagi
          {
            allTags.map(tag => {
              const isInPost = tags.indexOf(tag.id) >= 0;
              return (
                <div
                  className={c("tag", { "selected-tag": isInPost })}
                  onClick={() => dispatch({ type: isInPost ? "DELETE_TAG_FROM_POST" : "ADD_TAG_TO_POST", payload: tag.id })}
                  key={tag.id}
                >
                  {tag.name}
                  {
                    !isInPost &&
                      <IconButton className="delete-tag" onClick={e => { e.stopPropagation(); removeTag(tag.id); }}>
                        <DeleteIcon/>
                      </IconButton>
                  }
                </div>
              );
            })
          }
          <IconButton className="add-tag" onClick={() => dispatch({ type: "OPEN_TAG_DIALOG" })}>
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
          </div>
          <div className="editor">
            <div id="editor"/>
          </div>
        </div>
      </Container>
      <ImageDialog open={imageDialogOpen} onAdd={uploadImage} onClose={() => dispatch({ type: "CLOSE_IMAGE_DIALOG" })}/>
      <TagDialog open={tagDialogOpen} onAdd={uploadTag} onClose={() => dispatch({ type: "CLOSE_TAG_DIALOG" })}/>

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
    </MuiPickersUtilsProvider>
  );
}

export default AdminArticle;
