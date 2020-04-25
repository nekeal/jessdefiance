import React from "react";
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button} from "@material-ui/core";
import styled from "styled-components";
import {adminDate} from "../helpers/dateUtil";
import { useHistory } from "react-router-dom";
import {fonts} from "../helpers/styles";

const Container = styled(Card)`
  max-width: 500px;
  margin-right: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  
  p {
    margin-bottom: 0.5rem;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
  }
    
  .tag {
    font-family: ${fonts.secondaryFont};
    font-size: 1rem;
    border-radius: 1rem;
    margin-right: 0.6rem;
    margin-bottom: 0.6rem;
    padding: 0.2rem 0.6rem;
    color: #F3DFD9;      
    background-color: #3C3C3C;
  }
  
  .actions {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    font-size: 0.9rem;
  }
  
  .publish {
    margin-left: 0.5rem;
  }
`;

function ArticleTileAdmin({ article, onDelete, onPublish, onUnpublish }) {
  const { title, subtitle, images, backgroundImage, tags, published, publishAt, slug } = article;
  const history = useHistory();

  return (
    <Container>
      <CardActionArea>
        <CardMedia
          component="img"
          alt=""
          height="200"
          image={images.find(image => image.id === backgroundImage).thumbnails.small}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">{title}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">{subtitle}</Typography>
          <div className="tags">
            {
              tags.map(tag => <div className="tag" key={tag.id}>{ tag.name }</div> )
            }
          </div>
        </CardContent>
      </CardActionArea>
      <CardActions className="actions">
        <div>
          {
            published ?
              <>
                <span style={{ marginRight: "0.3rem" }}>Opublikowano</span>
                { adminDate(publishAt) }
                <Button size="small" className="publish" onClick={() => onUnpublish(slug)}>Cofnij</Button>
              </> :
              <>
                Nie opublikowano
                <Button size="small" className="publish" onClick={() => onPublish(slug)}>Opublikuj teraz</Button>
              </>
          }

        </div>
        <div>
          <Button size="small" color="secondary" onClick={() => onDelete(slug)}>Usuń</Button>
          <Button size="small" color="primary" onClick={() => history.push(`/panel/article/${slug}`)}>Edytuj</Button>
        </div>
      </CardActions>
    </Container>

  )
}

export default ArticleTileAdmin;
