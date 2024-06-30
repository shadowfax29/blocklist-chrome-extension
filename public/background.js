chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      chrome.storage.sync.get("blocklist", (data) => {
        const blocklist = data.blocklist || [];
        if (blocklist.some(url => changeInfo.url.includes(url))) {
          alert(`the site is blocked ${url}`)
          chrome.tabs.remove(tabId);
        }
      });
    }
  });
  