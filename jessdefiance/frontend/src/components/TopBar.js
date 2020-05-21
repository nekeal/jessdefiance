import React, {useRef, useState} from 'react';
import { useHistory } from "react-router-dom";
import main_logo from '../images/main_logo.png';
import main_logo_white from '../images/main_logo_white.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faSearch } from '@fortawesome/fontawesome-free-solid';
import { Link } from 'react-router-dom';
import { useOutsideClick } from "../helpers";
import styled, { css } from 'styled-components';
import {colors, fonts, mixins} from "../helpers/styles";
import { isLoggedIn } from "../helpers/authApi";

const Wrapper = styled.header`
  background: ${({ backgroundImage }) => backgroundImage ? `url(${backgroundImage}) rgba(0, 0, 0, 0.4)` : 'none'};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: multiply;
  
  .title {
    font-family: ${fonts.secondaryFont};
    font-size: 1.4rem;
    color: white;
    width: 75%;
    text-align: center;
    margin: 0 auto;
    padding-bottom: 3rem;
    
    @media(max-width: 768px) {
      padding-bottom: 1rem;
    }
  }
  
  .tags { 
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90%;
    margin: 0 auto;
    padding-bottom: 5rem;

    .tag {
      ${mixins.tag};
      color: ${colors.textColor};
      background-color: ${colors.backgroundAccent};
    }  
  }
  
`;

const NavBar = styled.div`
  width: calc(100% - 2rem);
  padding: 1rem;
  ${props => props.isArticleView && css`
    padding-bottom: 5rem;
    @media(max-width: 768px) {
      padding-bottom: 2rem;
    }
  `}
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media(min-width: 768px) {
    width: 80%;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  & > div {
    display: flex;
  }
`;

const ImageLogo = styled.img`
  width: 5rem;
`;

const MenuWrapper = styled.div`
  margin-left: 1rem;
  position: relative;
  width: 48px;
  height: 48px;
  
  @media(min-width: 768px) {
    width: initial;
    height: initial;
    display: flex;
    align-items: center;
  }

  
  .switch {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 1rem;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    transform: rotate(${props => props.expanded ? '90deg' : '0deg'});
    transition: transform 0.5s ease;
    cursor: pointer;
    
    .icon {
      color: #3e3e3e;
      font-size: 2.5rem;
    }
    
    @media(min-width: 768px) {
      display: none;
    }
  }
  
  .menu {
    font-family: ${fonts.secondaryFont};
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgb(242, 222, 216);
    border-radius: 1rem;
    box-shadow: ${props => props.isArticleView ? 'none' : '5px 3px 5px -1px rgb(161, 161, 161)'};
    width: ${props => props.expanded ? '160px' : '48px'};
    height: ${props => props.expanded ? '205px' : '48px'};
    transition: all 0.5s ease;
    z-index: 2;
    ${props => !props.expanded && css`transition-delay: 0.1s;`}
    
    @media(min-width: 768px) {
      position: relative;
      width: initial;
      height: initial;
      box-shadow: none;
      background-color: transparent;      
      color: ${props => props.isArticleView ? 'white' : 'initial'};
    }
    
    nav {
      font-size: 0.95rem;
      margin-top: 2rem;
      margin-left: 1rem;
      opacity: ${props => props.expanded ? '1' : '0'};
      transition: opacity 0.3s ease;
      ${props => props.expanded && css`transition-delay: 0.3s;`}
      
      @media(min-width: 768px) {
        margin: 0;
        opacity: 1;
        display: flex;
      }
    }
    
    a {
      display: block;
      margin: 0.3rem 0;
      
      @media(max-width: 768px) {
        font-size: ${props => props.expanded ? '1.2rem' : '0'};;
      }
      
      @media(min-width: 768px) {
        margin: 0.3rem 0.8rem;
      }
    }    
  }
`;

const SearchWrapper = styled.div`
  margin-left: auto;
  position: relative;
  background-color: ${props => props.expanded ? 'rgb(242, 222, 216)' : 'transparent'};
  width: ${props => props.expanded ? '220px' : '50px'};
  height: 48px;
  border-radius: 1rem;
  box-shadow: ${props => props.expanded ? '5px 3px 5px -1px rgb(161, 161, 161)' : 'none'};
  transition: all 0.5s ease;
  ${props => !props.expanded && 'transition-delay: 0.1s;'}
  
  input {
    font: inherit;
    pointer-events: ${props => props.expanded ? 'auto' : 'none'};
    opacity: ${props => props.expanded ? '1' : '0'};
    transition: opacity 0.3s ease;
    ${props => props.expanded && css`transition-delay: 0.3s;`}
  }
  
  .switch {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    cursor: pointer;
    z-index: 2;
    
    
    .icon {
      color: ${props => props.isArticleView ? 'white' : '#3e3e3e'};
      font-size: 1.5rem;
    }

  }
  
  .field {
    position: absolute;
    width: ${props => props.expanded ? '170px' : '0'};
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    
    input {
      width: 100%;
      border: none;
      background: transparent;
    }
  }
`;

function TopBar({ backgroundImage, title, tags }) {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const menuRef = useRef();
  const searchRef = useRef();
  const history = useHistory();

  useOutsideClick(menuRef, () => {
    if(menuExpanded) setMenuExpanded(false);
  });

  useOutsideClick(searchRef, () => {
    if(searchExpanded) setSearchExpanded(false);
  });

  const isArticleView = !!backgroundImage;

  return (
    <Wrapper backgroundImage={backgroundImage}>
      <NavBar isArticleView={isArticleView}>
        <Link to="/">
          <ImageLogo src={isArticleView ? main_logo_white : main_logo} alt='Jess Defiance Logo'/>
        </Link>
        <div>
          <SearchWrapper isArticleView={isArticleView} expanded={searchExpanded} ref={searchRef}>
            <div className="switch" onClick={() => {
              if(!searchExpanded) {
                setSearchExpanded(true);
              } else if(searchText === "") {
                setSearchExpanded(false);
              } else {
                history.push("/?search=" + searchText);
              }
            }}>
              <FontAwesomeIcon className="icon" icon={faSearch}/>
            </div>
            <div className="field">
              <input type="text"
                     value={searchText}
                     onChange={e => setSearchText(e.target.value)}
                     onKeyDown={e => e.keyCode === 13 && history.push("/?search=" + searchText) }
                     placeholder="Wpisz słowa klucze..."/>
            </div>
          </SearchWrapper>
          <MenuWrapper isArticleView={isArticleView} expanded={menuExpanded} ref={menuRef}>
            <div className="switch" onClick={() => setMenuExpanded(!menuExpanded)}>
              <FontAwesomeIcon className="icon" icon={faAngleDown}/>
            </div>
            <div className="menu">
              <nav>
                <Link to="/about">O mnie</Link>
                <Link to="/articles/fashion">#fashion</Link>
                <Link to="/articles/trends">#trends</Link>
                <Link to="/articles/deeper">#deeper</Link>
                <Link to="/contact">Kontakt</Link>
                { isLoggedIn() && <Link to="/panel">Panel</Link> }
              </nav>
            </div>
          </MenuWrapper>
        </div>
      </NavBar>
      { title && <div className="title">{title}</div> }
      { tags && <div className="tags">{tags.map(tag =>
        <div className="tag" key={tag.id} onClick={() => history.push(`/?tag=${tag.id}`)}>{tag.name}</div>)
      }</div>}
    </Wrapper>
  );
}

export default TopBar;
