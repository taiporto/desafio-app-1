import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root{
    --primary: #1C313D;
    --secondary: #AA2C2C;
  }

  body {
    margin: 0;
    font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    background-color: #F4F4F4;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  h1, h2{
    color: var(--primary);
    margin-bottom: 1em;
  }

  h1{
    font-size: 2.5em;
  }

  h2{
    font-size: 1.3em;
    font-weight: 400;
  }

  .main{
    text-align: center;
    margin-top: 10vh;
  }
`