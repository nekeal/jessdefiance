import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from "../components";
import styled from 'styled-components';
import Disqus from 'disqus-react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { getPost } from "../helpers/postsApi";
import ReactHtmlParser from 'react-html-parser';
import { articleDate } from "../helpers/dateUtil";
import {mixins} from "../helpers/styles";

const ArticleContent = styled.main`
  width: 80%;
  max-width: 1100px;
  margin: 1.5rem auto 0;
  font-size: 1.1rem;
  
  .info {
    font-family: LemonMilk;
    display: flex;
    justify-content: space-between;
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
  }
  
  .content {
    margin-top: 1rem;
    margin-bottom: 4rem;
    
    ${mixins.articleContent};
    
    img {
      cursor: pointer;
      @media(max-width: 768px) {
        width: 100%;
      }
    }
  }
`;

function Article() {
  const { id } = useParams();
  const [ galleryState, setGalleryState ] = useState({ photoIndex: 0, isOpen: false });
  const [ article, setArticle ] = useState(undefined);

  const { photoIndex, isOpen } = galleryState;

  useEffect(() => {
    getPost(id)
      .then(article => {
        let imgIndex = -1;
        const parsedContent = ReactHtmlParser(article.content, {
          transform: (node, index) => {
            if(node.name === "img") {
              imgIndex++;
              return <img src={node.attribs.src} alt="" onClick={() => setGalleryState({ photoIndex: imgIndex, isOpen: true })}/>
            }
          }
        });

        setArticle({ ...article, content: parsedContent });
      });
  }, []);


  const disqusShortname = 'jessdefiancetest';
  const disqusConfig = {
    url: 'http://jessdefiance.com/article/' + id,
    identifier: id,
    title: id,
  };



  const renderArticle = () => {
    const { title, subtitle, slug, category, content, publishAt, tags, images, backgroundImage } = article;
    console.log(article);
    return (
      <>
        <TopBar title={title} tags={tags} backgroundImage={images.find(image => image.id === backgroundImage).image}/>
        <ArticleContent>
          <div className="info">
            <div className="publication-date">{articleDate(publishAt)}</div>
            <div className="category">{category}</div>
          </div>
          <div className="content">{content}</div>
          <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </ArticleContent>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex].image}
            nextSrc={images[(photoIndex + 1) % images.length].image}
            prevSrc={images[(photoIndex + images.length - 1) % images.length].image}
            onCloseRequest={() => setGalleryState({ isOpen: false })}
            onMovePrevRequest={() =>
              setGalleryState({
                isOpen: true,
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              setGalleryState({
                isOpen: true,
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
      </>
    )
  };

  return (
    <>
      { article && renderArticle()}
    </>
  );
}

export default Article;
