chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  //Status Code 1: Return UserInfo
  if (message.statusCode == 1) {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error("Auth error:", chrome.runtime.lastError.message);
        sendResponse({ success: false, message: "Auth failed" });
        return;
      }

      chrome.identity.getProfileUserInfo(function(userInfo) {
        console.log("userInfo:", userInfo);
        sendResponse({ success: true, message: userInfo });
      });
    });

    return true;
  }else if(message.statusCode == 2){
    //Handling for status code 2
  }

  return false;
});