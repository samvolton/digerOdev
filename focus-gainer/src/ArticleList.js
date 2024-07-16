import React from 'react';

function ArticleList({ articles }) {
  return (
    <div className="article-list">
      <h2>Saved Articles</h2>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
            <span className="article-date">
              {new Date(article.date).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticleList;