import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from "../components";
import styled from 'styled-components';
import Disqus from 'disqus-react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { getPost } from "../helpers/postsApi";
import ReactHtmlParser from 'react-html-parser';

// const article = { id: 1, title: 'Jaki jest Twój typ sylwetki?', subtitle: 'Lorem ipsum dolor sit amet', publicationDate: '01 12 19', category: '#fashion', backgroundImage: 'https://picsum.photos/800/600'};

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
  
  .content {
    margin-top: 1rem;
    
    h2 {
      font-family: LemonMilk;
      font-weight: normal;
    }
    
    h3 {
      font-family: LemonMilk;
      font-weight: normal;
    }
    
    ol {
      list-style: none;
      counter-reset: counter;
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
      font-style: italic;
    }
    
    img {
      width: 80%;
      border-radius: 1rem;
      box-shadow: 7px 15px 3px 0px #CBB7B0; 
      margin: 2rem auto;
      display: block;
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

        setArticle({ ...article, content: parsedContent, images: article.images.map(image => image.image) });
      });
  }, []);


  const disqusShortname = 'jessdefiancetest';
  const disqusConfig = {
    url: 'http://jessdefiance.com/article/' + id,
    identifier: id,
    title: id,
  };

  const renderArticle = () => {
    const { title, slug, category, content, publishedAt, tags, images } = article;
    return (
      <>
        <TopBar title={title} backgroundImage='https://picsum.photos/800/600'/>
          <ArticleContent>
          <div className="info">
          <div className="publication-date">{publishedAt}</div>
          <div className="category">{category}</div>
          </div>
          <div className="content">
            {content}
          </div>
          <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </ArticleContent>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
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
