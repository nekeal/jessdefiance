import React, {useEffect, useRef, useState} from 'react';
import { Controller, useForm } from "react-hook-form";
import Quill from 'quill';
import styled from "styled-components";
import { TextField, Select, InputLabel, MenuItem, FormControlLabel, Checkbox, Button, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getPost, addImage } from "../helpers/postsApi";
import { useParams } from 'react-router-dom';
import generateSlug from 'slug';

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
  
  .post-images {
    margin-top: 2rem;
    
    .image {
      
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

function AdminArticle() {
  const { register, handleSubmit, errors, setValue, setError, getValues, control } = useForm();
  const [ article, setArticle ] = useState({});
  const [ images, setImages ] = useState([]);
  const [ tags, setTags ] = useState([]);
  const editor = useRef();
  const { id } = useParams();


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
        setArticle(article);
        const { title, category, publishAt, published, content, images, tags } = article;
        setValue("title", title);
        setValue("category", category);
        setValue("publishAt", publishAt);
        setValue("published", published);
        editor.current.clipboard.dangerouslyPasteHTML(0, content);
        setImages(images);
        setTags(tags);
      });

    // editor.on('text-change', function(delta, oldDelta, source) {
    //   console.log(editor.root.innerHTML);
    // });
  }, []);

  const onSubmit = data => {
    const { title, category, publishAt, published } = data;
    const slug = article.slug || generateSlug(title);
    const post = {
      title, slug, category, publishAt, published,
      content: editor.current.root.innerHTML,
      images: images.map(image => image.id)
    };
  };

  const uploadImage = e => {
    e.persist();

    addImage(e.target.files[0])
      .then(image => setImages([...images, image]));
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

          <Controller name="publishAt" control={control} as={
            <DateTimePicker
              autoOk
              ampm={false}
              label="Czas publikacji"
            />
          }/>

          <FormControlLabel
            control={
              <Checkbox/>
            }
            label="Opublikowany"
          />

          <Button variant="contained" color="primary" type="submit">
            Zapisz zmiany
          </Button>
        </form>
        <div className="post-images">
          Zdjęcia
          {
            images.map((image, index) => <div className="image">
              <img src={image.thumbnail} alt="" onClick={insertImage(index)}/>
            </div>)
          }
          <IconButton component="label" className="add-image">
            <AddIcon/>
            <input
              type="file"
              style={{ display: "none" }}
              onChange={uploadImage}
            />
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
    </MuiPickersUtilsProvider>
  );
}

export default AdminArticle;
