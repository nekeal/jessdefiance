import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {articleDate} from "../helpers/dateUtil";
import {fonts} from "../helpers/styles";

const Article = styled.div`
  margin: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  color: white;
  background: ${({ image }) => `url(${image})`} rgba(0, 0, 0, 0.4);
  background-position: center; 
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: multiply;
  box-shadow: 7px 15px 3px 0px #CBB7B0;
  justify-content: space-between;
  
  .publication-date {
    font-family: ${fonts.secondaryFont};
    margin: 0.7rem;
    align-self: flex-start;
  }
  
  .heading {
    width: 75%;
    align-self: center;
    text-align: center;
  }
  
  .title {
    font-family: ${fonts.secondaryFont};
    margin-top: 1.1rem;
    margin-bottom: 0.8rem;
    font-size: 1.3rem;
    line-height: 1.3;
  }
  
  .subtitle {
    margin-bottom: 1.1rem;
  }
  
  .category {
    font-family: ${fonts.secondaryFont};
    margin: 0.7rem;
    align-self: flex-end;
  }
  
  @media(max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

function ArticleTile({ article }) {
  const { title, subtitle, category, images, backgroundImage, tags, publishAt, slug } = article;
  return (
    <Article image={images.find(image => image.id === backgroundImage).image}>
      <div className="publication-date">
        {articleDate(publishAt)}
      </div>
      <div className="heading">
        <Link to={'/article/' + slug}>
          <div className="title">{title}</div>
          {
            article.subtitle &&
            <div className="subtitle">{article.subtitle}</div>
          }
        </Link>
      </div>
      <div className="category">#{category}</div>
    </Article>
  );
}

export default ArticleTile;
