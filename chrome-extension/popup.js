document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  chrome.storage.local.get(['gojiberryEmail'], (result) => {
    if (result.gojiberryEmail) {
      emailInput.value = result.gojiberryEmail;
      statusDiv.textContent = `Status: Active for ${result.gojiberryEmail}`;
    }
  });

  saveBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (email) {
      chrome.storage.local.set({ gojiberryEmail: email }, () => {
        statusDiv.textContent = `Saved! Background script will now poll for tasks.`;
        // Trigger background script to check immediately
        chrome.runtime.sendMessage({ action: "checkTasksNow" });
      });
    }
  });
});
