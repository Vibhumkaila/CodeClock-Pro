let siteTimeData = {};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ siteTimeData });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateTime") {
    updateSiteTime(request.url);
  }
});

function updateSiteTime(url) {
  const currentTime = Date.now();
  const lastVisitTime = siteTimeData[url] || 0;
  const timeSpent = currentTime - lastVisitTime;

  siteTimeData[url] = currentTime;

  chrome.storage.local.set({ siteTimeData });
}
