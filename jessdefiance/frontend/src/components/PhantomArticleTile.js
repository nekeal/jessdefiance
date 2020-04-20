import React from 'react';
import styled from 'styled-components';

const Article = styled.div`
  margin: 1rem;
  height: 12rem;
  border-radius: 1rem;
  box-shadow: 7px 15px 3px 0px #CBB7B0;
  
  background: linear-gradient(45deg, #f2ded8, #3e3e3e);
  background-size: 400% 400%;
  
  animation: AnimationName 3s ease infinite;
  
  @keyframes AnimationName { 
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
  }
`;

function PhantomArticleTile() {
  return (
    <Article/>
  );
}

export default PhantomArticleTile;
