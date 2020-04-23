export const mixins = {
  articleContent: `
    font-family: SegoeUI, sans-serif;
    
    h2 {
      font-family: LemonMilk;
      font-weight: normal;
      margin: 1rem 0;
    }
    
    h3 {
      font-family: LemonMilk;
      font-weight: normal;
      margin: 0.7rem 0;
    }
    
    p {
      font-family: SegoeUI, sans-serif;
      margin: 0.4rem 0;
    }
    
    ol {
      list-style: none;
      counter-reset: counter;
      font: inherit;
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
      border: none;
      margin: 0.5rem 0;
      padding-left: 1rem;
      font-style: italic;
      font-size: 1.2rem;
    }
    
    img {
      width: 80%;
      border-radius: 1rem;
      box-shadow: 7px 15px 3px 0px #CBB7B0; 
      margin: 2rem auto;
      display: block;
    }
    
    .ql-align-center {
      text-align: center;
    }
  `
};
