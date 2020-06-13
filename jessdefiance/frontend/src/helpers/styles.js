import { css } from 'styled-components';

export const colors = {
  textColor: "#3C3C3C",
  backgroundColor: "#FFFFFF",
  backgroundAccent: "#F3DFD9",
  shadowColor: "#C7B0AB"
};

export const fonts = {
  primaryFont: "'Montserrat', sans-serif",
  secondaryFont: "LemonMilk"
};

export const mixins = {
  articleContent: css`
    font-family: ${fonts.primaryFont};
    
    h2 {
      font-family: ${fonts.secondaryFont};
      font-weight: normal;
      margin: 1rem 0;
    }
    
    h3 {
      font-family: ${fonts.secondaryFont};
      font-weight: normal;
      margin: 0.7rem 0;
    }
    
    p {
      font-family: ${fonts.primaryFont};
      margin: 0.4rem 0;
      line-height: 1.7;
    }
    
    ol {
      list-style: none;
      counter-reset: counter;
      font: inherit;
    }
    
    ol li {
      counter-increment: counter;
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
    
    ol li::before {
      display: inline-block;
      content: "#" counter(counter);
      font-family: ${fonts.secondaryFont};
      width: 2rem;
    }
    
    blockquote {
      border: none;
      margin: 0.5rem 0;
      padding-left: 1rem;
      font-style: italic;
      font-size: 1.2rem;
    }
    
    img {
      max-width: 80%;
      max-height: 90vh;
      border-radius: 1rem;
      box-shadow: 7px 15px 3px 0px #CBB7B0; 
      margin: 2rem auto;
      display: block;
    }
    
    .ql-align-center {
      text-align: center;
    }
    
    .ql-size-small {
      font-size: 0.9rem;
    }
  `,
  tag: css`
    font-family: ${fonts.secondaryFont};
    font-size: 1rem;
    border-radius: 1rem;
    margin-right: 0.6rem;
    margin-bottom: 0.6rem;
    padding: 0.2rem 0.6rem;
    color: ${colors.backgroundColor};      
    background-color: ${colors.textColor};
    flex-shrink: 0;
    cursor: pointer;
    
    &--selected {
      background-color: ${colors.backgroundAccent};      
      color: ${colors.textColor};
    }
  `
};
