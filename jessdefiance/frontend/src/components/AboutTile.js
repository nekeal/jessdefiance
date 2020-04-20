import React from 'react';
import styled from 'styled-components';
import jess from "../images/jess.jpg";

const AboutWrapper = styled.main`
  margin: 1rem;
  
  .title {
    font-family: LemonMilk;
    text-align: center;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  
  .image {
    width: 100%;
    margin-bottom: 2rem;
    
    img {
      width: 100%;
      border-radius: 1rem;
      box-shadow: 7px 15px 3px 0px #CBB7B0;
    }
  }
  
  .content {
    margin: 0 1rem;
  }
`;


function ArticleTile() {
  return (
    <AboutWrapper>
      <div className="title">O mnie</div>
      <div className="image"><img src={jess} alt=""/></div>
      <div className="content">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, ea est et fugiat illum iusto laborum molestiae mollitia nemo obcaecati pariatur perspiciatis, qui quia quibusdam quod tempore vel. Doloribus, fugiat.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, autem beatae blanditiis consequuntur, corporis ea eligendi, illum ipsa ipsum molestias mollitia natus nemo non reprehenderit repudiandae vero voluptatem. Distinctio, earum.</p>
      </div>
    </AboutWrapper>
  );
}

export default ArticleTile;
