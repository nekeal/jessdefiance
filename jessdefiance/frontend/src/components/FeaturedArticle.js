import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
    font-family: LemonMilk;
    margin: 0.7rem;
    font-size: 1.5rem;
    align-self: flex-start;
  }
  
  .title {
    font-family: LemonMilk;
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
  }
  
  .category {
    font-family: LemonMilk;
    font-size: 1.5rem;
    margin: 0.7rem;
    align-self: flex-end;
  }
`;

function FeaturedArticle({ article }) {
  return (
    <Article image={article.backgroundImage}>
      <div className="article-data">
        <div className="publication-date">
          {article.publicationDate}
        </div>
        <div className="title">
          <Link to={'/article/' + article.id}>
            {article.title}
          </Link>
        </div>
        <div className="subtitle">
          {article.subtitle}
        </div>
        <div className="category">
          {article.category}
        </div>
      </div>
    </Article>
  );
}

export default FeaturedArticle;
