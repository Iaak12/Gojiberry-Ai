// Check if this page is part of an active task
chrome.storage.local.get(['currentTask'], (result) => {
  const task = result.currentTask;
  if (!task) return; // Not a task-managed page

  console.log("=== GOJIBERRY AI AUTOMATOR ===");
  console.log("Executing Task:", task.stepType);
  console.log("Target Message:\n", task.message);
  
  // To avoid real brittle DOM clicking or accidental bans during development,
  // we simulate the action using an alert and console log.
  
  setTimeout(() => {
    alert(`[Gojiberry AI Extension]\nSimulating sending LinkedIn ${task.stepType} to this profile.\n\nMessage Payload:\n${task.message}`);
    
    // Tell background script we are done so it can mark it completed and close tab
    chrome.runtime.sendMessage({ action: "taskCompleted" });
  }, 3000); // Wait 3 seconds to let page load before alerting
});
