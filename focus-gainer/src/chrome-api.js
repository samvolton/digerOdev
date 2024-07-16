/*global chrome*/

export const getCurrentTab = () => {
    return new Promise((resolve) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        resolve(tabs[0]);
      });
    });
  };
  
  export const saveToStorage = (key, value) => {
    return new Promise((resolve) => {
      chrome.storage.sync.set({[key]: value}, resolve);
    });
  };
  
  export const getFromStorage = (key) => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result) => {
        resolve(result[key]);
      });
    });
  };