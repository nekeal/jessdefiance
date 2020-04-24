import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {articleDate} from "../helpers/dateUtil";
import {fonts} from "../helpers/styles";

const Article = styled.div`
  color: white;
  background: ${({ image }) => `url(${image})`} rgba(0, 0, 0, 0.4);
  background-position: center; 
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: multiply;
  margin-bottom: 2rem;
  
  .article-data {
    display: flex;
    flex-direction: column;
    width: 80%;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .publication-date {
    font-family: ${fonts.secondaryFont};
    margin: 0.7rem;
    font-size: 1.5rem;
    align-self: flex-start;
  }
  
  .title {
    font-family: ${fonts.secondaryFont};
    margin-top: 4rem;
    margin-bottom: 0.8rem;
    align-self: center;
    width: 75%;
    text-align: center;
    font-size: 2rem;
    line-height: 1.3;
  }
  
  .subtitle {
    margin-bottom: 4rem;
    align-self: center;
    font-size: 1.5rem;
    text-transform: uppercase;
  }
  
  .category {
    font-family: ${fonts.secondaryFont};
    font-size: 1.5rem;
    margin: 0.7rem;
    align-self: flex-end;
  }
`;

function FeaturedArticle({ article }) {
  const { title, subtitle, category, images, backgroundImage, tags, publishAt, slug } = article;
  return (
    <Article image={images.find(image => image.id === backgroundImage).image}>
      <div className="article-data">
        <div className="publication-date">{articleDate(publishAt)}</div>
        <div className="title">
          <Link to={'/article/' + slug}>{title}</Link>
        </div>
        <div className="subtitle">Najnowszy artykuł</div>
        <div className="category">#{category}</div>
      </div>
    </Article>
  );
}

export default FeaturedArticle;
