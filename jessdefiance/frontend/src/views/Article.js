import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from "../components";
import styled from 'styled-components';
import Disqus from 'disqus-react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { getPost } from "../helpers/postsApi";

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

// const articleHTML = `
//   <h2>First header</h2>
//   <p><strong>Lorem ipsum dolor sit amet</strong>, consectetur adipisicing elit. Animi autem dolor est magni maiores nesciunt perspiciatis qui quibusdam tempora. Accusamus atque delectus dolore doloremque est facere inventore officia reprehenderit vitae! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam cumque exercitationem incidunt maxime neque nesciunt optio quibusdam, quo quod soluta vel velit vero? Cumque distinctio ducimus illo in ipsum totam! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid assumenda commodi consectetur, cumque dignissimos doloremque dolorum enim esse expedita in iure laborum modi necessitatibus nesciunt, perferendis quae quam quisquam voluptatibus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda atque consectetur ducimus earum enim expedita incidunt non perspiciatis similique voluptatem. Cupiditate dolorem doloremque dolores facere magnam modi quam similique unde?</p>
//   <h3>Second header</h3>
//   <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A excepturi ipsum minus quis. Alias, beatae culpa eligendi exercitationem illum inventore magni minus numquam odit, officia sint soluta, suscipit vel voluptatem. Lorem ipsum dolor sit amet, consectetur adipisicing elit. A at dicta distinctio doloribus error facere, facilis harum illum ipsa labore libero odit, officia possimus quas recusandae reiciendis repudiandae tempore unde? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam asperiores aut beatae, consectetur cumque doloribus ducimus laboriosam laborum magnam molestiae pariatur placeat, quaerat repudiandae saepe sapiente similique, sit vel voluptatibus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, asperiores excepturi? Eaque ex fugit ipsam labore maiores mollitia nihil, porro quae quam quod rem reprehenderit, totam unde! Cupiditate molestias, veritatis.</p>
//   <img src="https://picsum.photos/800/600" alt="Alternative photo text"/>
//   <p>For more awesome content check out this <a href="https://picsum.photos/" target="_blank" rel="noopener noreferrer">awesome page</a></p>
//   <ol>
//     <li>First item</li>
//     <li>Second item</li>
//     <li>Item between second and third but it is quite long</li>
//     <li>Third item</li>
//   </ol>
//   <img src="https://picsum.photos/1000/700" alt="Alternative photo text"/>
//   <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam at autem corporis doloremque ea exercitationem expedita facere laudantium libero nisi non, odit optio praesentium, quae quam quisquam sequi soluta velit? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem doloremque doloribus eos exercitationem explicabo facere laborum magni molestias nostrum odio, optio pariatur perferendis quidem recusandae rerum suscipit tenetur, ut voluptatem? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid autem cumque cupiditate enim expedita facere itaque, iusto labore libero magnam mollitia, nihil nulla optio provident recusandae sapiente, soluta tempore.</p>
//   <blockquote>"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsam iste odit provident! Adipisci animi at excepturi expedita incidunt ipsa ipsum, maiores molestiae, pariatur quas quisquam, rem sint suscipit vero."</blockquote>
// `;

// const images = ['https://picsum.photos/800/600', 'https://picsum.photos/1000/700'];

function Article() {
  const { id } = useParams();
  const [ galleryState, setGalleryState ] = useState({ photoIndex: 0, isOpen: false });
  const [ article, setArticle ] = useState(undefined);
  const contentRef = useRef();

  const { photoIndex, isOpen } = galleryState;

  useEffect(() => {
    getPost(id)
      .then(article => setArticle(article));
  });

  useEffect(() => {
    const node = contentRef.current;
    if(node) {
      [...node.querySelectorAll(".content img")].forEach((image, index) => {
        image.addEventListener('click', () => {
          setGalleryState({ isOpen: true, photoIndex: index });
        });
      });
    }
  }, [article]);


  // const disqusShortname = 'jessdefiancetest';
  // const disqusConfig = {
  //   url: 'http://jessdefiance.com/article/' + id,
  //   identifier: id,
  //   title: title,
  // };

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
          <div className="content" ref={contentRef} dangerouslySetInnerHTML={{__html: content}}>
          </div>
          {/*<Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />*/}
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
