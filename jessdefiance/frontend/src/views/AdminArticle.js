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
import {
  getPost,
  addImage,
  deleteImage,
  updatePost,
  addPost,
  getTags,
  addTag,
  deleteTag,
  getPosts,
  partialUpdatePost
} from "../helpers/postsApi";
import { useParams, useHistory } from 'react-router-dom';
import ImageDialog from "../components/ImageDialog";
import TagDialog from "../components/TagDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import c from 'classnames';
import MuiAlert from "@material-ui/lab/Alert/Alert";
import {mixins} from "../helpers/styles";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {fonts} from "../helpers/styles";
import slugify from "slugify";

const Container = styled.main`    
  max-width: 1200px;
  margin: 0 auto;
  
  .form-line {
    margin-top: 1.5rem;
    display: flex;
    align-items: flex-start;
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
    flex-direction: column;
    align-items: flex-end;
  }
  
  .ql-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
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
    font-family: ${fonts.secondaryFont};
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
  confirmationDialog: {
    open: false,
    onConfirm: () => {},
    onDecline: () => {}
  },
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
    case "ADD_IMAGE_ERROR":
      newImages = article.images.filter(image => image.name !== payload);
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
    case "OPEN_CONFIRMATION_DIALOG":
      const { onConfirm, onDecline } = payload;
      return { ...state, confirmationDialog: { open: true, onConfirm, onDecline } };
    case "CLOSE_CONFIRMATION_DIALOG":
      return { ...state, confirmationDialog: { open: false } };
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
  const history = useHistory();

  const { article: { images, tags }, allTags, imageDialogOpen, tagDialogOpen, confirmationDialog, operationInfo } = state;

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

  const submitAction = {
    NOTHING: "NOTHING",
    GOTO_LIST: "GOTO_LIST",
    GOTO_POST: "GOTO_POST"
  };

  const onSubmit = (data, event, action = submitAction.NOTHING) => {
    const { title, subtitle, category, publishAt, published, backgroundImage } = data;
    const slug = state.article.slug || slugify(title, { remove: /[\\/*+~.()'"!:@]/g });

    if(!backgroundImage) {
      dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "O nieeee Jessi, tym razem nie wypierdolisz bloga, ustaw zdjęcie główne XD^XD"  } });
      return;
    }

    const post = {
      title, subtitle, slug, category, publishAt, published, backgroundImage,
      content: editor.current.root.innerHTML,
      images: images.map(image => image.id),
      tags
    };

    if(state.article.slug) {
      updatePost(post)
        .then(() => {
          if(action === submitAction.GOTO_LIST) {
            history.push("/panel");
          } else if(action === submitAction.GOTO_POST) {
            history.push(`/article/${id}`)
          } else {
            dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie zapisano zmiany" } });
          }
        })
        .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Wystąpił błąd przy zapisywaniu zmian"  } }));
    } else {
      addPost(post)
        .then(createdPost => {
          if(action === submitAction.GOTO_LIST) {
            history.push("/panel");
          } else if(action === submitAction.GOTO_POST) {
            history.push(`/article/${createdPost.slug}`);
          } else {
            history.push(`/panel/article/${createdPost.slug}`);
            dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Pomyślnie dodano post" } });
          }
        })
        .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Wystąpił błąd przy dodawaniu posta"  } }))
    }
  };

  const uploadImage = (name, image) => {
    dispatch({ type: "ADD_IMAGE_START", payload: name });
    addImage(name, image)
      .then(imageObj => dispatch({ type: "ADD_IMAGE_END", payload: imageObj }))
      .catch(() => {
        dispatch({ type: "ADD_IMAGE_ERROR", payload: name });
        dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Wystąpił błąd przy dodawaniu zdjęcia" } });
      });
  };

  const removeImageInit = id => {
    const src = images.find(image => image.id === id).thumbnails.large;
    if(editor.current.root.innerHTML.includes(src)) {
      dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie można usunąć zdjęcia, bo znajduje się jeszcze w artykule" } });
    } else {
      dispatch({ type: "OPEN_CONFIRMATION_DIALOG", payload: { onConfirm: () => removeImageConfirm(id), onDecline: () => {} } });
    }
  };

  const removeImageConfirm = id => {
    deleteImage(id)
      .then(response => dispatch({ type: "REMOVE_IMAGE", payload: id }))
      .catch(() => dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Wystąpił błąd przy usuwaniu zdjęcia" } }));
  };

  const setBackgroundImage = imgId => {
    if(!id) {
      setValue("backgroundImage", imgId);
      dispatch({ type: "SET_BACKGROUND_IMAGE" });
    } else {
      partialUpdatePost(id, { background_image: imgId })
        .then(() => {
          setValue("backgroundImage", imgId);
          dispatch({ type: "SET_OPERATION_INFO", payload: { type: "success", message: "Udało się zmienić zdjęcie główne" } });
          dispatch({ type: "SET_BACKGROUND_IMAGE" });
        })
        .catch(() => {
          dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie udało się zmienić zdjęcia głównego" } });
        });
    }
  };

  const insertImage = index => {
    const selection = editor.current.getSelection();
    const postIndex = selection ? selection.index : 0;

    editor.current.insertEmbed(postIndex, 'image', images[index].thumbnails.large);
  };

  const insertXD = () => {
    const selection = editor.current.getSelection();
    const postIndex = selection ? selection.index : 0;

    editor.current.insertText(postIndex, "xD");
    editor.current.insertText(postIndex + 2, "xD", { script: "super" });
    editor.current.insertText(postIndex + 4, " ", { script: null });
  };

  const uploadTag = name => {
    addTag(name)
      .then(tagObj => dispatch({ type: "ADD_TAG", payload: tagObj }));
  };

  const removeTagInit = id => {
    getPosts({ tag: id })
      .then(response => {
        if(response.length !== 0) {
          dispatch({ type: "SET_OPERATION_INFO", payload: { type: "warning", message: "Nie można usunąć tagu, bo znajduje się w innych artykułach" } });
        } else {
          dispatch({ type: "OPEN_CONFIRMATION_DIALOG", payload: { onConfirm: () => removeTagConfirm(id), onDecline: () => {} } });
        }
      });
  };

  const removeTagConfirm = id => {
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
              <Controller name="category" defaultValue="FASHION" control={control} rules={{ required: "Pole jest wymagane"}} as={
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
              <Button color="primary" type="submit">
                Zapisz zmiany
              </Button>
              <Button color="secondary" type="submit" onClick={e => { e.preventDefault(); onSubmit(getValues(), e, submitAction.GOTO_LIST); }}>
                Zapisz i wróć do listy
              </Button>
              <Button color="secondary" type="submit" onClick={e => { e.preventDefault(); onSubmit(getValues(), e, submitAction.GOTO_POST); }}>
                Zapisz i przejdź do posta
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
                  <img src={image.thumbnails.small} alt="" onClick={() => insertImage(index)}/>
                  <div className="name">{image.name}</div>
                  <IconButton className={c("set-background-image", {"background-image": values.backgroundImage === image.id})} onClick={() => setBackgroundImage(image.id)}>
                    <StarIcon/>
                  </IconButton>
                  {
                    values && values.backgroundImage !== image.id &&
                    <IconButton className="delete-image" onClick={() => removeImageInit(image.id)}>
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
                      <IconButton className="delete-tag" onClick={e => { e.stopPropagation(); removeTagInit(tag.id); }}>
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
              <select className="ql-size" defaultValue="">
                <option value="small"/>
                <option value=""/>
              </select>
            </span>
            <span className="ql-formats">
              <button className="ql-align" value="center"/>
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
            <span className="ql-formats">
              <button className="ql-script" value="sub"/>
              <button className="ql-script" value="super"/>
            </span>
            <span className="ql-formats">
              <button onClick={insertXD}>xD<sup>xD</sup></button>
            </span>
          </div>
          <div className="editor">
            <div id="editor"/>
          </div>
        </div>
      </Container>
      <ConfirmationDialog
        open={confirmationDialog.open}
        onDecline={() => { dispatch({ type: "CLOSE_CONFIRMATION_DIALOG" }); confirmationDialog.onDecline(); }}
        onConfirm={() => { dispatch({ type: "CLOSE_CONFIRMATION_DIALOG" }); confirmationDialog.onConfirm(); }}
      />
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
