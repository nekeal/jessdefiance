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


function AboutTile() {
  return (
    <AboutWrapper>
      {/*<div className="title">O mnie</div>*/}
      <div className="image">
        <Link to="/about"><img src={jess} alt=""/></Link>
      </div>
      <div className="content">
        <p>Hola!</p>
        <p>Z tej strony Jess – stylistka i pasjonatka sztuki. W zasadzie – pasjonatka świata oraz ludzi.</p>
        <p>Ten blog powstał po to, by w czeluściach internetu istniało miejsce dla każdej i każdego z Was. Będziemy tutaj bawić się modą, poznawać i starać się ją zrozumieć.</p>
        <p>Niezależnie od tego, z jakim zasobem wiedzy przychodzisz, powinno się tutaj znaleźć coś dla Ciebie. Przejdziemy przez podstawy, ale regularnie będziemy sięgać też do świata high fashion.</p>
        <p>A ponieważ to miejsce powstało dla Ciebie, to największą nagrodą dla mnie będzie, jeśli od czasu do czasu zostawisz tutaj coś po sobie.</p>

        <Link to="/about">Czytaj więcej</Link>
      </div>
    </AboutWrapper>

  );
}

export default AboutTile;
