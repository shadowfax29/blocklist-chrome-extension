/*global chrome*/
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [blocklist, setBlocklist] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['blocklist', 'enabled'], (result) => {
        setBlocklist(result.blocklist || []);
        setEnabled(result.enabled !== false);
      });
    } else {
      console.warn('chrome.storage.sync is not available.');
    }
  }, []);

  const addUrl = () => {
    const updatedBlocklist = [...blocklist, newUrl];
    setBlocklist(updatedBlocklist);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ blocklist: updatedBlocklist }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting blocklist:', chrome.runtime.lastError);
        }
      });
    }
    setNewUrl('');
  };

  const removeUrl = (url) => {
    const updatedBlocklist = blocklist.filter(item => item !== url);
    setBlocklist(updatedBlocklist);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ blocklist: updatedBlocklist }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error removing blocklist:', chrome.runtime.lastError);
        }
      });
    }
  };

  const toggleExtension = () => {
    const newStatus = !enabled;
    setEnabled(newStatus);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ enabled: newStatus }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error toggling extension:', chrome.runtime.lastError);
        }
      });
    }
  };

  return (
    <div className="App col-md-2">
      <h1 className='text-danger'>Blocklist</h1>
      <input 
      className='form-control'
        type="text" 
        value={newUrl} 
        onChange={(e) => setNewUrl(e.target.value)} 
        placeholder="Add URL to block" 
      />
      <button  className='btn btn-success m-2' onClick={addUrl}>Add</button>
      <ul className='list-group m-2'>
        {blocklist.map((url, index) => (
          <li className="list-group-item"key={index}>
            {url}
            <button className='btn btn-danger' onClick={() => removeUrl(url)}>Remove</button>
          </li>
        ))}
      </ul>
      <button className='btn btn-warning' onClick={toggleExtension}>
        {enabled ? 'Disable' : 'Enable'} Extension
      </button>
    </div>
  );
}

export default App;
