// DOM Elements
const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const bestWpmDisplay = document.getElementById('best-wpm');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const themeToggle = document.getElementById('theme-toggle');
const timeSelect = document.getElementById('time-select');
const progressBar = document.getElementById('progress-bar');

// Test texts
const texts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is perfect for typing practice.",
  "JavaScript is a versatile programming language that powers the modern web. It enables interactive user interfaces and dynamic content.",
  "Practice makes perfect, especially when it comes to typing speed and accuracy. Consistent daily practice will improve your skills significantly.",
  "Success is the sum of small efforts repeated day in and day out. Every keystroke brings you closer to mastering the art of typing.",
  "Technology has revolutionized the way we communicate, work, and learn. Typing skills are more important than ever in our digital world.",
  "The best time to plant a tree was twenty years ago. The second best time is now. Start improving your typing skills today.",
  "Artificial intelligence and machine learning are transforming industries across the globe. These technologies require precise data input and coding skills.",
  "Clean code is not written by following a set of rules. You don't become a software craftsman by learning a list of heuristics.",
];

// App state
let timer = 60;
let maxTime = 60;
let timerRunning = false;
let interval;
let totalTyped = 0;
let correctChars = 0;
let testStarted = false;
let currentText = '';

// Load best WPM from localStorage
let bestWpm = localStorage.getItem('bestWpm') || 0;
bestWpmDisplay.textContent = bestWpm;

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

// Progress bar animation
function updateProgressBar() {
  const elapsed = maxTime - timer;
  const progress = (elapsed / maxTime) * 100;
  progressBar.style.width = `${progress}%`;
}

// Initialize test
function initTest() {
  const randomIndex = Math.floor(Math.random() * texts.length);
  currentText = texts[randomIndex];
  textDisplay.textContent = currentText;
  textInput.value = '';
  
  maxTime = parseInt(timeSelect.value);
  timer = maxTime;
  timerDisplay.textContent = timer;
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100';
  totalTyped = 0;
  correctChars = 0;
  testStarted = false;
  timerRunning = false;
  
  // Reset progress bar
  progressBar.style.width = '100%';
  
  // Reset UI state
  textInput.disabled = true;
  startBtn.disabled = false;
  restartBtn.disabled = true;
  timeSelect.disabled = false;
  
  clearInterval(interval);
}

// Start test
function startTest() {
  textInput.disabled = false;
  textInput.focus();
  startBtn.disabled = true;
  restartBtn.disabled = false;
  timeSelect.disabled = true;
  testStarted = true;
}

// Handle text input
function handleInput() {
  if (!timerRunning && testStarted) {
    timerRunning = true;
    interval = setInterval(updateTimer, 1000);
  }

  const enteredText = textInput.value;
  totalTyped = enteredText.length;

  // Calculate correct characters
  correctChars = 0;
  for (let i = 0; i < enteredText.length && i < currentText.length; i++) {
    if (enteredText[i] === currentText[i]) {
      correctChars++;
    }
  }

  // Update accuracy
  const accuracy = totalTyped > 0 ? (correctChars / totalTyped) * 100 : 100;
  accuracyDisplay.textContent = accuracy.toFixed(0);

  // Update WPM in real-time
  if (timerRunning) {
    const timeElapsed = (maxTime - timer) / 60; // in minutes
    if (timeElapsed > 0) {
      const wordsTyped = enteredText.trim().split(/\s+/).filter(word => word.length > 0).length;
      const currentWpm = Math.round(wordsTyped / timeElapsed);
      wpmDisplay.textContent = currentWpm;
    }
  }

  // Check if test is complete
  if (enteredText === currentText) {
    endTest();
  }
}

// Update timer
function updateTimer() {
  timer--;
  timerDisplay.textContent = timer;
  updateProgressBar();

  if (timer === 0) {
    endTest();
  }
}

// End test
function endTest() {
  clearInterval(interval);
  timerRunning = false;
  textInput.disabled = true;
  startBtn.disabled = false;
  restartBtn.disabled = false;
  timeSelect.disabled = false;
  
  // Calculate final WPM
  const timeElapsed = (maxTime - timer) / 60 || maxTime / 60; // in minutes
  const wordsTyped = textInput.value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const finalWpm = Math.round(wordsTyped / timeElapsed);
  wpmDisplay.textContent = finalWpm;
  
  // Update best WPM
  if (finalWpm > bestWpm) {
    bestWpm = finalWpm;
    bestWpmDisplay.textContent = bestWpm;
    localStorage.setItem('bestWpm', bestWpm);
    
    // Add celebration effect
    bestWpmDisplay.style.animation = 'none';
    setTimeout(() => {
      bestWpmDisplay.style.animation = 'pulse 0.5s ease-in-out 3';
    }, 10);
  }
}

// Restart test
function restartTest() {
  initTest();
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
startBtn.addEventListener('click', startTest);
restartBtn.addEventListener('click', restartTest);
textInput.addEventListener('input', handleInput);
timeSelect.addEventListener('change', initTest);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    restartTest();
  }
  if (e.key === 'Enter' && e.ctrlKey) {
    if (!testStarted) {
      startTest();
    }
  }
});

// Add pulse animation for best WPM
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

// Initialize app
initTheme();
initTest();
