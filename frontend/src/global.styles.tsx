import { createGlobalStyle } from "styled-components";
import OpenSans from "../resources/fonts/OpenSans-VariableFont_wdth,wght.ttf";
import OpenSansItalic from "../resources/fonts/OpenSans-Italic-VariableFont_wdth,wght.ttf";

export const GlobalStyles = createGlobalStyle`

  @font-face {
    font-family: 'Open Sans';
    src: url(${OpenSans}) format('truetype');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap; 
  }

  @font-face {
    font-family: 'Open Sans';
    src: url(${OpenSansItalic}) format('truetype');
    font-weight: 100 900;
    font-style: italic;
    font-display: swap; 
  }

  :root {
    font-family: 'Open Sans', system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light;
    color: #2c3e50;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* Primary color variable */
    --primary-color: #FEAD1E;
    --primary-hover: #e69a15;
    --primary-light: #fef3e0;

    --secondary-color: #36454F;
    

    --desktop-breakpoint: 1024px;
  }

  * {
    box-sizing: border-box;
  }

  a {
    font-weight: 500;
    color: var(--primary-color);
    text-decoration: inherit;
  }

  a:hover {
    color: var(--primary-hover);
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }

  h3 {
    margin-bottom: 10px;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #ffffff;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.25s;
  }

  button:hover {
    border-color: var(--primary-color);
  }

  button:focus {
    &:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
  }

  #root {
    max-width: 1280px;
    margin: 0 auto;
    padding: 1rem;
    width: 100%;
    @media screen and (min-width: 1024px) {
      padding: 2rem;
    }
  }



  /* Recharts specific styles */
  .recharts-wrapper,
  .recharts-surface {
    &:focus,
    &:focus-visible {
      outline: none;
    }
  }
`;
