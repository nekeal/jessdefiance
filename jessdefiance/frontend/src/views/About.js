import React from 'react';
import { TopBar, AboutTile } from "../components";
import styled from 'styled-components';
import jess from "../images/jess.jpg";

const Container = styled.div`
  .title {
    font-family: LemonMilk;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    
    @media(max-width: 900px) {
      text-align: center;
    } 
  }

  .about {
    margin: 0 auto;
    max-width: min(90%, 1200px);
    display: flex;
    
    @media(max-width: 900px) {
      flex-direction: column;
      align-items: center;
    }
  }
  
  .image {
    width: min(90%, 400px);
    flex-shrink: 0;
    
    img {
      width: 100%;
      border-radius: 1rem;
      box-shadow: 7px 15px 3px 0px #CBB7B0;
    }
  }

  
  .content {
    margin-left: 2rem;
    
    @media(max-width: 900px) {
      margin-left: 0;
    } 
  }
`;

function About() {
  return (
    <Container>
      <TopBar/>
      <div className="about">
        <div className="image"><img src={jess} alt=""/></div>
        <div className="content">
          <div className="title">O mnie</div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, ea est et fugiat illum iusto laborum molestiae mollitia nemo obcaecati pariatur perspiciatis, qui quia quibusdam quod tempore vel. Doloribus, fugiat.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, autem beatae blanditiis consequuntur, corporis ea eligendi, illum ipsa ipsum molestias mollitia natus nemo non reprehenderit repudiandae vero voluptatem. Distinctio, earum.</p>
        </div>
      </div>
    </Container>
  );
}

export default About;
