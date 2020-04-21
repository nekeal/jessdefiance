import React from 'react';
import { TopBar } from "../components";
import styled from 'styled-components';
import { faFacebookSquare, faTwitterSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

const ContactWrapper = styled.main`
  margin: 1rem;

  .title {
    font-family: LemonMilk;
    text-align: center;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  
  .content {
    margin: 2rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .contact-item {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
    
    //@media(min-width: 800px) {
    //  justify-content: center;
    //}
  }
  
  .item-description {
    margin-left: 0.6rem;
  }
`;

function Contact() {
  return (
    <>
      <TopBar/>
      <ContactWrapper>
        <div className="title">Kontakt</div>
        <div className="content">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <div className="contact-item">
              <FontAwesomeIcon icon={faFacebookSquare} color='rgb(62, 62, 62)' size="2x"/>
              <div className="item-description">jessdefiance</div>
            </div>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <div className="contact-item">
              <FontAwesomeIcon icon={faTwitterSquare} color='rgb(62, 62, 62)' size="2x"/>
              <div className="item-description">jessdefiance</div>
            </div>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <div className="contact-item">
              <FontAwesomeIcon icon={faInstagramSquare} color='rgb(62, 62, 62)' size="2x"/>
              <div className="item-description">jessdefiance</div>
            </div>
          </a>
        </div>
      </ContactWrapper>
    </>
  );
}

export default Contact;
