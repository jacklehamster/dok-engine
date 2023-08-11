import React from 'react';
import * as ReactDOMClient from 'react-dom';
import { App } from './App';



const root = document.getElementById('root');
root!.style.height = "100vh";
root!.style.width = "100vw";
document.body.style.margin = "0px";

ReactDOMClient.render(<App></App>, root);
