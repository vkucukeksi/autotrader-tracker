// Background Service Worker for AutoTrader Time Tracker
const AUTOTRADER_URLS = ['autotrader.co.uk'];
let tabTracking = {}; // Track each tab separately

// Initialize storage
chrome.storage.local.get('totalTime', (result) => {
  if (!result.totalTime) {
    chrome.storage.local.set({ totalTime: 0, sessions: [] });
  }
});

// Monitor tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    updateTracking(tab);
  });
});

// Monitor tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateTracking(tab);
  }
});

// Monitor tab closure
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabTracking[tabId]) {
    const sessionTime = Date.now() - tabTracking[tabId];
    saveSession(sessionTime);
    delete tabTracking[tabId];
  }
});

function updateTracking(tab) {
  const isAutotrader = AUTOTRADER_URLS.some(url => tab.url?.includes(url));
  const wasTracking = tabTracking[tab.id] !== undefined;
  
  if (isAutotrader && !wasTracking) {
    // Started using AutoTrader
    tabTracking[tab.id] = Date.now();
    console.log('Started tracking tab', tab.id, 'on AutoTrader');
  } else if (!isAutotrader && wasTracking) {
    // Left AutoTrader
    const sessionTime = Date.now() - tabTracking[tab.id];
    saveSession(sessionTime);
    delete tabTracking[tab.id];
    console.log('Ended session, time:', sessionTime);
  }
}

function saveSession(timeInMs) {
  chrome.storage.local.get(['totalTime', 'sessions'], (result) => {
    const totalTime = (result.totalTime || 0) + timeInMs;
    const sessions = result.sessions || [];
    
    sessions.push({
      date: new Date().toISOString(),
      duration: timeInMs
    });
    
    chrome.storage.local.set({ totalTime, sessions });
  });
}
