let isTimerRunning = true;
let timerInterval;
let totalTime = 0;

function updateTimeDisplay() {
  const totalTimeInSeconds = Math.round(totalTime / 1000);
  document.getElementById("totalTime").innerText = `Total time spent: ${totalTimeInSeconds} seconds`;
}

chrome.storage.local.get("siteTimeData", (data) => {
  const siteTimeData = data.siteTimeData || {};
  totalTime = calculateTotalTime(siteTimeData);
  updateTimeDisplay();
});

function calculateTotalTime(siteTimeData) {
  let total = 0;

  for (const url in siteTimeData) {
    total += Date.now() - siteTimeData[url];
  }

  return total;
}

function updateSiteTime(url) {
  const currentTime = Date.now();
  const lastVisitTime = siteTimeData[url] || 0;
  const timeSpent = currentTime - lastVisitTime;

  siteTimeData[url] = currentTime;

  chrome.storage.local.set({ siteTimeData });
  totalTime += timeSpent;
  updateTimeDisplay();
}

function toggleTimer() {
  if (isTimerRunning) {
    clearInterval(timerInterval);
  } else {
    timerInterval = setInterval(() => {
      totalTime += 1000;
      updateTimeDisplay();
    }, 1000);
  }

  isTimerRunning = !isTimerRunning;
}

function resetTimer() {
  clearInterval(timerInterval);
  totalTime = 0;
  updateTimeDisplay();
}

document.getElementById("timer").addEventListener("click", toggleTimer);
document.getElementById("timer").addEventListener("dblclick", resetTimer);
document.getElementById("timer").addEventListener("mousedown", (event) => {
  let offsetX = event.clientX;
  let offsetY = event.clientY;

  function handleMouseMove(moveEvent) {
    const newX = moveEvent.clientX;
    const newY = moveEvent.clientY;

    const deltaX = newX - offsetX;
    const deltaY = newY - offsetY;

    const timer = document.getElementById("timer");
    timer.style.left = `${timer.offsetLeft + deltaX}px`;
    timer.style.top = `${timer.offsetTop + deltaY}px`;

    offsetX = newX;
    offsetY = newY;
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
});


