import React, { useState, useEffect } from 'react';
import './App.css';
import ArticleList from './components/ArticleList';
import SaveButton from './components/SaveButton';
import FocusCoins from './components/FocusCoins';
import { getFromStorage, saveToStorage } from './chrome-api';

function App() {
  const [articles, setArticles] = useState([]);
  const [focusCoins, setFocusCoins] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const savedArticles = await getFromStorage('articles') || [];
      const savedCoins = await getFromStorage('focusCoins') || 0;
      setArticles(savedArticles);
      setFocusCoins(savedCoins);
    };
    loadData();
  }, []);

  const saveArticle = async (article) => {
    const newArticles = [...articles, article];
    setArticles(newArticles);
    await saveToStorage('articles', newArticles);
    
    // Reward user with a focus coin
    const newFocusCoins = focusCoins + 1;
    setFocusCoins(newFocusCoins);
    await saveToStorage('focusCoins', newFocusCoins);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ReadLater Organizer</h1>
        <FocusCoins coins={focusCoins} />
      </header>
      <SaveButton onSave={saveArticle} />
      <ArticleList articles={articles} />
    </div>
  );
}

export default App;