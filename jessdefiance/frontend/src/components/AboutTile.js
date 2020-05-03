import React from 'react';
import styled from 'styled-components';
import jess from "../images/jess.jpg";
import { Link } from "react-router-dom";
import {fonts} from "../helpers/styles";

const AboutWrapper = styled.main`
  margin: 1rem;
  
  .image {
    width: 100%;
    margin-bottom: 2rem;
    
    img {
      width: 100%;
      border-radius: 1rem;
      box-shadow: 7px 15px 3px 0px #CBB7B0;
    }
  }
  
  a {
    color: darkblue;
  }
  
  p {
    line-height: 1.5;
  }
`;


function ArticleTile() {
  return (
    <AboutWrapper>
      {/*<div className="title">O mnie</div>*/}
      <div className="image">
        <Link to="/about"><img src={jess} alt=""/></Link>
      </div>
      <div className="content">
        <p>Z tej strony Jess, stylista mody i pasjonatka sztuki. W zasadzie pasjonatka w wielu dziedzinach.</p>
        <p>Będziemy tutaj bawić się modą, poznawać i starać się ją zrozumieć. Niezależnie od tego co już wiesz i jak bardzo liczy się dla Ciebie to, z czym się ona wiąże, powinno się znaleźć tutaj coś dla Ciebie. Zaczniemy od podstaw, ale regularnie będziemy zaglądać też do świata high fashion.</p>
        <p>A ponieważ blog ten jest miejscem dla nas wszystkich, to zachęcam Cię do tego, byś aktywnie uczestniczył(a) w tym co się tutaj dzieje, bo to będzie dla mnie największa nagroda!</p>
        <Link to="/about">Czytaj więcej</Link>
      </div>
    </AboutWrapper>

  );
}

export default ArticleTile;
