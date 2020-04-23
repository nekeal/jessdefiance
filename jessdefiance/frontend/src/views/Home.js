import React, {useEffect, useState} from 'react';
import {useParams, useLocation, useHistory, Link} from 'react-router-dom';
import { FeaturedArticle, ArticleTile, PhantomArticleTile, AboutTile, TopBar } from "../components";
import styled from 'styled-components';
import debounce from "lodash.debounce";
import {getPosts, getTags} from '../helpers/postsApi';
import c from "classnames";

// const articlesMocks = [
//   { id: 1, title: 'Jaki jest Twój typ sylwetki?', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '01 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/1600/1200'},
//   { id: 2, title: 'Thy Mighty Contract', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '02 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/780/600'},
//   { id: 3, title: 'Non Serviam', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '03 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/790/600'},
//   { id: 4, title: 'Triarchy of the Lost Lovers', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '04 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/800/600'},
//   { id: 5, title: 'A Dead Poem', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '05 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/810/600'},
//   { id: 6, title: 'Sleep of the Angels', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '06 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/820/600'},
//   { id: 7, title: 'Khronos', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '07 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/830/600'},
//   { id: 8, title: 'Genesis', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '08 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/815/600'},
//   { id: 9, title: 'Sanctus Diavolos', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '09 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/825/600'},
// ];

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
    font-family: LemonMilk;
    font-size: 1rem;
    border-radius: 1rem;
    margin-right: 0.6rem;
    margin-bottom: 0.6rem;
    padding: 0.2rem 0.6rem;
    color: #F3DFD9;      
    background-color: #3C3C3C;
    flex-shrink: 0;
    cursor: pointer;
    
    &--selected {
      background-color: #F3DFD9;      
      color: #3C3C3C;
    }
  }
  
  .about-header {
    flex-basis: 33%;
    flex-shrink: 0;
    font-family: LemonMilk;
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
        setOffset(paginateBy);
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
      getPosts({ limit: paginateBy, offset: 9, category: category && category.toUpperCase(), search, tag: selectedTags })
        .then(newArticles => {
          setOffset(offset + paginateBy);
          if(newArticles.length === 0) {
            setFetchingState(articlesState.ALL_LOADED);
          } else {
            setArticles(articles.concat(newArticles));
            setFetchingState(articlesState.IDLE);
          }
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
        return <div className="all-fetched">Nie ma więcej artykułów.</div>;
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
