chrome.runtime.onStartup.addListener(() => {
    checkSigninStatus();
  });
  
  chrome.runtime.onInstalled.addListener(() => {
    checkSigninStatus();
  });
  
  function checkSigninStatus() {
    chrome.identity.getProfileUserInfo((userInfo) => {
      if (!userInfo.email) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Not Signed In",
          message: "Please sign in to your Google account. This extension will now disable itself.",
          priority: 2
        });
        
        chrome.management.getSelf(ext => {
          chrome.management.setEnabled(ext.id, false);
        });
      }
    });
  }
