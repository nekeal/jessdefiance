import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from "../components";
import styled from 'styled-components';
import Disqus from 'disqus-react';
import Lightbox from 'react-image-lightbox';
import './lightbox.css';
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
  const [ disqus, setDisqus ] = useState(undefined);
  const [ articleImages, setArticleImages ] = useState([]);

  const { photoIndex, isOpen } = galleryState;

  useEffect(() => {
    getPost(id)
      .then(article => {
        let imgIndex = -1;
        const { images, backgroundImage } = article;
        articleImages.push(images.find(image => image.id === backgroundImage));
        const parsedContent = ReactHtmlParser(article.content, {
          transform: (node, index) => {
            if(node.name === "img") {
              imgIndex++;
              articleImages.push(images.find(image => image.image === node.attribs.src));
              return <img src={node.attribs.src} alt="" onClick={() => setGalleryState(
                { photoIndex: article.images.findIndex(image => image.image === node.attribs.src), isOpen: true })}
              />
            }
          }
        });

        setDisqus({
          shortname: "jess-defiance",
          config: {
            url: "https://jessdefiance.art/article" + id,
            identifier: id,
            title: article.title
          }
        });

        setArticle({ ...article, content: parsedContent });
      });
  }, []);


  const renderArticle = () => {
    const { title, subtitle, slug, category, content, publishAt, tags, images, backgroundImage } = article;
    return (
      <>
        <TopBar title={title} tags={tags} backgroundImage={images.find(image => image.id === backgroundImage).image}/>
        <ArticleContent>
          <div className="info">
            <div className="publication-date">{articleDate(publishAt)}</div>
            <div className="category">{category}</div>
          </div>
          <div className="content">{content}</div>
          {
            disqus && <Disqus.DiscussionEmbed shortname={disqus.shortname} config={disqus.config} />
          }
        </ArticleContent>
        {isOpen && (
          <Lightbox
            mainSrc={articleImages[photoIndex].image}
            nextSrc={articleImages[(photoIndex + 1) % articleImages.length].image}
            prevSrc={articleImages[(photoIndex + articleImages.length - 1) % articleImages.length].image}
            onCloseRequest={() => setGalleryState({ isOpen: false })}
            onMovePrevRequest={() =>
              setGalleryState({
                isOpen: true,
                photoIndex: (photoIndex + articleImages.length - 1) % articleImages.length,
              })
            }
            onMoveNextRequest={() =>
              setGalleryState({
                isOpen: true,
                photoIndex: (photoIndex + 1) % articleImages.length,
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
