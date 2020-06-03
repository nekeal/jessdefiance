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
import {fonts} from "../helpers/styles";
import urlParse from "url-parse";
import { Fab } from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";
import { isLoggedIn } from "../helpers/authApi";

const ArticleContent = styled.main`
  width: 80%;
  max-width: 1100px;
  margin: 1.5rem auto 0;
  font-size: 1.1rem;
  
  .info {
    font-family: ${fonts.secondaryFont};
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
  
  .image-caption {
    width: 100%;
    text-align: center;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
  }
  
  .MuiFab-root {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
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
        let imgIndex = 0;
        const { images, backgroundImage } = article;
        articleImages.push(images.find(image => image.id === backgroundImage));
        const parsedContent = ReactHtmlParser(article.content, {
          transform: (node, index) => {
            if(node.name === "img") {
              imgIndex++;
              const img = images.find(image => urlParse(image.thumbnails.large).pathname === urlParse(node.attribs.src).pathname);
              if(!img) return <></>;

              articleImages.push(img);
              const ind = imgIndex;
              return <>
                <img src={img.thumbnails.large} alt="" onClick={() => setGalleryState({ photoIndex: ind, isOpen: true })}/>
                <div className="image-caption">{img.name}</div>
              </>
            }
          }
        });

        setArticleImages(articleImages);


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
    const { title, subtitle, slug, category, content, publishAt, tags, images, backgroundImage: backgroundImageId } = article;
    const backgroundImage = images.find(image => image.id === backgroundImageId);
    return (
      <>
        <TopBar title={title} tags={tags} backgroundImage={backgroundImage && backgroundImage.thumbnails.large}/>
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
      {
        isLoggedIn() &&
        <Fab href={`/panel/article/${id}`} color="secondary" style={{ position: "fixed", bottom: "2rem", right: "2rem" }}>
          <EditIcon/>
        </Fab>
      }
    </>
  );
}

export default Article;
