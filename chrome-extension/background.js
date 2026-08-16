let pollingInterval;

function pollTasks() {
  chrome.storage.local.get(['gojiberryEmail'], async (result) => {
    const email = result.gojiberryEmail;
    if (!email) return;

    try {
      const response = await fetch(`http://localhost:3000/api/extension/tasks?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.task) {
        console.log("Found pending task:", data.task);
        // We have a task! Open a new tab with the target URL
        chrome.tabs.create({ url: data.task.linkedinUrl, active: false }, (tab) => {
          // Save the current task to storage so the content script knows what to do
          chrome.storage.local.set({ currentTask: data.task, currentTabId: tab.id });
        });
      }
    } catch (e) {
      console.error("Failed to poll Gojiberry API", e);
    }
  });
}

// Poll every 1 minute
chrome.alarms.create("pollGojiberry", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pollGojiberry") {
    pollTasks();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkTasksNow") {
    pollTasks();
  } else if (request.action === "taskCompleted") {
    // Notify the server
    chrome.storage.local.get(['currentTask'], async (result) => {
      const task = result.currentTask;
      if (task) {
        await fetch(`http://localhost:3000/api/extension/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: task._id, status: 'completed' })
        });
        chrome.storage.local.remove(['currentTask', 'currentTabId']);
        // Close the tab
        if (sender.tab && sender.tab.id) {
          chrome.tabs.remove(sender.tab.id);
        }
      }
    });
  }
});
