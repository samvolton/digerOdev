import React from 'react';
import { getCurrentTab } from '../chrome-api';

function SaveButton({ onSave }) {
  const handleSave = async () => {
    const currentTab = await getCurrentTab();
    const article = {
      url: currentTab.url,
      title: currentTab.title,
      date: new Date().toISOString()
    };
    onSave(article);
  };

  return (
    <button onClick={handleSave} className="save-button">
      Save This Page
    </button>
  );
}

export default SaveButton;