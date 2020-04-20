import React, {useEffect, useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FeaturedArticle, ArticleTile, PhantomArticleTile, AboutTile, TopBar } from "../components";
import styled from 'styled-components';
import debounce from "lodash.debounce";
import {addPost, getPosts} from '../helpers/postsApi';
import {login} from "../helpers/authApi";

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

const ArticleTileWrapper = styled.main`
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
    
    @media(max-width: 768px) {
      display: none;
    }
  }
`;

const PhantomArticles = styled.div`
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
`;

const AllFetched = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: darkblue;
  margin: 2rem auto 3rem;
`;

const FetchingError = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: darkred;
  margin: 2rem auto 3rem;
`;

const articlesState = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  ALL_LOADED: 'ALL_LOADED'
};


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Home() {
  const [fetchingState, setFetchingState] = useState(articlesState.IDLE);
  const [articles, setArticles] = useState([]);
  const { category } = useParams();
  const query = useQuery();

  // console.log(category);
  // console.log(query.get("search"));

  // login('admin', 'admin').then(() => {
  //   addPost({
  //     title: 'Jaki jest Twój typ sylwetki?',
  //     slug: 'some-slug-7',
  //     subtitle: 'Lorem ipsum dolor sit amet',
  //     publish_at: '2018-02-18T17:05:57Z',
  //     category: 'NOTES',
  //     backgroundImage: 'https://picsum.photos/1600/1200',
  //     content: '<p>no content at all</p>',
  //     published: true,
  //   });
  // });

  const renderFetchingState = () => {
    switch (fetchingState) {
      case articlesState.LOADING:
        return <PhantomArticles>
          <PhantomArticleTile/>
          <PhantomArticleTile/>
          <PhantomArticleTile/>
        </PhantomArticles>;
      case articlesState.ERROR:
        return <FetchingError>Błąd ładowania artykułów. Spróbuj ponownie później.</FetchingError>;
      case articlesState.ALL_LOADED:
        return <AllFetched>Nie ma więcej artykułów.</AllFetched>;
      default:
        return <></>
    }
  };

  useEffect(() => {
    getPosts()
      .then(articles => {
        setArticles(articles);
      });
  }, []);

  window.onscroll = debounce(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= 0.7 * document.documentElement.offsetHeight && fetchingState === articlesState.IDLE) {
      setFetchingState(articlesState.LOADING);
      // fetchArticles()
      //   .then(newArticles => {
      //     setArticles(articles.concat(newArticles));
      //     setFetchingState(articlesState.IDLE);
      //   })
      //   .catch(error => {
      //     setFetchingState(articlesState.ERROR);
      //   })
    }
  }, 100);

  return (
    <>
      <TopBar/>
      {/*<FeaturedArticle article={articles[0]}/>*/}
      {/*<div*/}
      {/*  className="canva-embed"*/}
      {/*  data-design-id="DAD327Jy9SI"*/}
      {/*  data-height-ratio="1.7778"*/}
      {/*  style={{padding:"177.7778% 5px 5px 5px", background: "rgba(0,0,0,0.03)", borderRadius: "8px"}}*/}
      {/*/>*/}

      <ArticleTileWrapper>
        { !category && <div className="about">
          <AboutTile/>
        </div> }
        { articles.map(article => <ArticleTile key={article.id} article={article}/>) }
      </ArticleTileWrapper>
      {renderFetchingState()}
    </>
  );
}

export default Home;
