import React, {useEffect, useState} from 'react';
import {useParams, useLocation, useHistory, Link} from 'react-router-dom';
import { FeaturedArticle, ArticleTile, PhantomArticleTile, AboutTile, TopBar } from "../components";
import debounce from "lodash.debounce";
import {getPosts, getTags} from '../helpers/postsApi';
import c from "classnames";
import {colors, fonts, mixins} from "../helpers/styles";
import styled from "styled-components";

const Container = styled.div`
  .article-tile-wrapper {
    width: 80%;
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: ". . about" ". . about"  ". . about";
    
    @media(max-width: 1366px) {
      width: 90%;
      grid-template-columns: repeat(2, 1fr);
      grid-template-areas: ". about" ". about"  ". about";
    }
    
    @media(max-width: 768px) {
      width: 100%;
      display: block;
    }  
    
    .about {
      grid-area: about;
      margin-left: 1rem;
      
      @media(max-width: 768px) {
        display: none;
      }
    }
  }
  
  .phantom-articles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 80%;
    max-width: 1400px;
    margin: 0 auto;
    
    @media(max-width: 1366px) {
      width: 90%;
      grid-template-columns: repeat(2, 1fr);
      
      *:nth-child(3) {
        display: none;
      }
    }
    
    @media(max-width: 768px) {
      width: 100%;
      display: block;
      
      *:nth-child(2), *:nth-child(3) {
        display: none;
      }
    }
  }
  
  .all-fetched {
    text-align: center;
    font-size: 1.5rem;
    margin: 2rem auto 3rem;
  }
  
  .fetching-error {
    text-align: center;
    font-size: 1.5rem;
    color: darkred;
    margin: 2rem auto 3rem;
  }
  
  .wrapper-header {
    width: 80%;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    
    @media(max-width: 1366px) {
      width: 90%;
    }
    
    @media(max-width: 768px) {
      width: 100%;
    }
  }
  
  .tags {
    flex-basis: 66%;
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    margin-left: 1rem;
    
    @media(max-width: 1366px) {
      flex-basis: 50%;
    }
    
    @media(max-width: 768px) {
      flex-basis: 100%;
    }
    
    &--full-width {
      flex-basis: 100%;
    }
  }

  .tag {
    ${mixins.tag};
  }  
  
  .about-header {
    flex-basis: 33%;
    flex-shrink: 0;
    font-family: ${fonts.secondaryFont};
    text-align: center;
    font-size: 1.3rem;
    align-self: flex-end;
    
    @media(max-width: 1366px) {
      flex-basis: 50%;
    }
    
    @media(max-width: 768px) {
      display: none;
    }
  }

`;

const articlesState = {
  INIT: 'INIT',
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  ALL_LOADED: 'ALL_LOADED'
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const paginateBy = 9;

function Home() {
  const [ fetchingState, setFetchingState ] = useState(articlesState.INIT);
  const [ articles, setArticles ] = useState([]);
  const [ offset, setOffset ] = useState(0);
  const [ tags, setTags ] = useState([]);
  const { category } = useParams();
  const history = useHistory();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const search = query.get("search");
  const selectedTags = query.has("tag") ? query.getAll("tag").map(tag => parseInt(tag)) : [];

  useEffect(() => {
    getTags()
      .then(tags => setTags(tags));
  }, []);

  useEffect(() => {
    getPosts({ limit: paginateBy, offset: 0, category: category && category.toUpperCase(), search, tag: selectedTags })
      .then(articles => {
        setOffset(articles.length);
        if(!articles) {
          setFetchingState(articlesState.ALL_LOADED);
        } else {
          setArticles(articles);
          setFetchingState(articlesState.IDLE);
        }
      })
      .catch(() => setFetchingState(articlesState.ERROR));
  }, [ category, location ]);

  window.onscroll = debounce(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= 0.7 * document.documentElement.offsetHeight && fetchingState === articlesState.IDLE) {
      setFetchingState(articlesState.LOADING);
      getPosts({ limit: paginateBy, offset: offset, category: category && category.toUpperCase(), search, tag: selectedTags })
        .then(newArticles => {
          setOffset(offset + newArticles.length);
          if(newArticles.length < paginateBy) {
            setFetchingState(articlesState.ALL_LOADED);
          } else {
            setFetchingState(articlesState.IDLE);
          }
          setArticles(articles.concat(newArticles));
        })
        .catch(error => {
          setFetchingState(articlesState.ERROR);
        })
    }
  }, 100);

  const switchTag = tagId => {
    tagId = tagId.toString();
    let tags = query.getAll("tag");
    query.delete("tag");

    if(tags.indexOf(tagId) >= 0) tags = tags.filter(tag => tag !== tagId);
    else tags.push(tagId);

    tags.forEach(tag => query.append("tag", tag));

    history.push({
      pathname: location.pathname,
      search: "?" + query.toString()
    });
  };

  const renderFetchingState = () => {
    switch (fetchingState) {
      case articlesState.LOADING:
      case articlesState.INIT:
        return <div className="phantom-articles">
          <PhantomArticleTile/>
          <PhantomArticleTile/>
          <PhantomArticleTile/>
        </div>;
      case articlesState.ERROR:
        return <div className="fetching-error">Błąd ładowania artykułów. Spróbuj ponownie później.</div>;
      case articlesState.ALL_LOADED:
        return <div className="all-fetched">Nie ma więcej artykułów</div>;
      default:
        return <></>
    }
  };


  return (
    <Container>
      <TopBar/>
      { !search && selectedTags.length === 0 && articles[0] && <FeaturedArticle article={articles[0]}/> }
      {
        fetchingState !== articlesState.INIT &&
          <>
            <div className="wrapper-header">
              <div className={c("tags", {"tags--full-width": category || search})}>
                {
                  tags.map(tag => <div
                    key={tag.id}
                    className={c("tag", {"tag--selected": selectedTags.indexOf(tag.id) >= 0})}
                    onClick={() => switchTag(tag.id)}
                  >{tag.name}</div> )
                }
              </div>
              {
                !category && !search &&
                <div className="about-header"><Link to="/about">O mnie</Link></div>
              }
            </div>
            <div className="article-tile-wrapper">
              {
                !category && !search &&
                <div className="about">
                  <AboutTile/>
                </div>
              }
              { articles && articles.map(article => <ArticleTile key={article.slug} article={article}/>) }
            </div>
          </>
      }
      {renderFetchingState()}
    </Container>
  );
}

export default Home;
