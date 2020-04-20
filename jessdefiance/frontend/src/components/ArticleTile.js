import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
    font-family: LemonMilk;
    margin: 0.7rem;
    align-self: flex-start;
  }
  
  .heading {
    width: 75%;
    align-self: center;
    text-align: center;
  }
  
  .title {
    font-family: LemonMilk;
    margin-top: 1.1rem;
    margin-bottom: 0.8rem;
    font-size: 1.3rem;
    line-height: 1.3;
  }
  
  .subtitle {
    margin-bottom: 1.1rem;
  }
  
  .category {
    font-family: LemonMilk;
    margin: 0.7rem;
    align-self: flex-end;
  }
  
  @media(max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

function ArticleTile({ article }) {
  return (
    <Article image={article.backgroundImage}>
      <div className="publication-date">
        {article.publishedAt}
      </div>
      <div className="heading">
        <Link to={'/article/' + article.slug}>
          <div className="title">
              {article.title}
          </div>
          {/*<div className="subtitle">*/}
          {/*  {article.subtitle}*/}
          {/*</div>*/}
        </Link>
      </div>
      <div className="category">
        {article.category}
      </div>
    </Article>
  );
}

export default ArticleTile;
