
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

  //Status Code 2: Retrieve salt for given web url
  }else if(message.statusCode == 2){
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error("Auth error:", chrome.runtime.lastError.message);
        sendResponse({ success: false, message: "Auth failed" });
        return;
      }

      chrome.storage.local.get(["bst"], function(data){
        //For each Node: weburl is index 0, salt is index 1, left index is index 2, right index is index 3
        var current = 0;
        //Create root node if no data exists
        if(Object.keys(data).length == 0){
          data.bst = [[message.hostName, generateWebsiteSalt(), null, null]];
        //Find spot to put new Node or see if it exists
        }else{
          var endCon = false;
          while(!endCon){
            //Found the needed hostName
            if(data.bst[current][0] == message.hostName){
              endCon = true;
              continue;
            }

            //Check if left or right
            if(message.hostName < data.bst[current][0]){
              if(data.bst[current][2] != null){
                current = data.bst[current][2];
              }else{
                data.bst.push([message.hostName, generateWebsiteSalt(), null, null]);
                data.bst[current][2] = data.bst.length-1;
                current = data.bst.length-1;
                endCon = true;
              }
            }else{
              if(data.bst[current][3] != null){
                current = data.bst[current][3];
              }else{
                data.bst.push([message.hostName, generateWebsiteSalt(), null, null]);
                data.bst[current][3] = data.bst.length-1;
                current = data.bst.length-1;
                endCon = true;
              }
            }
          }
        }
        chrome.storage.local.set({ bst: data.bst });
        sendResponse({success: true, message: data.bst});
        return;
      });
    });
    return true;

  }

  return false;
});

function generateWebsiteSalt(){
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var output = ""
  for (var i = 0; i < 6; i++){
    output += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return output;
}

