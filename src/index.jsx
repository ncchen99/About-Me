import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// 添加全局樣式，確保滾動正常工作
const style = document.createElement('style');
style.textContent = `
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: auto;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
); 