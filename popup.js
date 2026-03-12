// Popup UI logic
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  document.getElementById('resetBtn').addEventListener('click', resetData);
  
  // Refresh stats every second
  setInterval(loadStats, 1000);
});

function loadStats() {
  chrome.storage.local.get(['totalTime', 'sessions'], (result) => {
    const totalTime = result.totalTime || 0;
    const sessions = result.sessions || [];
    
    // Display total time
    document.getElementById('totalTime').textContent = formatTime(totalTime);
    
    // Display today's time
    const todayTime = getTodayTime(sessions);
    document.getElementById('todayTime').textContent = formatTime(todayTime);
    
    // Display session count
    document.getElementById('sessionCount').textContent = sessions.length;
    
    // Display recent sessions
    displaySessions(sessions);
  });
}

function getTodayTime(sessions) {
  const today = new Date().toDateString();
  return sessions
    .filter(s => new Date(s.date).toDateString() === today)
    .reduce((total, s) => total + s.duration, 0);
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function displaySessions(sessions) {
  const list = document.getElementById('sessionsList');
  list.innerHTML = '';
  
  const recentSessions = sessions.slice(-5).reverse();
  
  recentSessions.forEach(session => {
    const date = new Date(session.date);
    const duration = formatTime(session.duration);
    
    const elem = document.createElement('div');
    elem.className = 'session-item';
    elem.innerHTML = `
      <span>${date.toLocaleString()}</span>
      <span>${duration}</span>
    `;
    list.appendChild(elem);
  });
}

function resetData() {
  if (confirm('Are you sure you want to reset all tracking data?')) {
    chrome.storage.local.set({ totalTime: 0, sessions: [] }, () => {
      loadStats();
    });
  }
}
