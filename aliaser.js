// aliaser.js
function hashCode(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    // for each char in password
    for (i = 0; i < str.length; i++) {
        // get unicode value of each character
        chr   = str.charCodeAt(i);
        // shift bits left 5 spaces (multiply by 32) then subtract from original
        // then add character code hash to "blend it in"
        // TODO: look into better hash function for storing passwords
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function generateAlias(simplePassword, domain) {
    const combined = simplePassword + "@" + domain;
    const hash = hashCode(combined);
    return btoa(hash.toString()).slice(0, 12); // Base64 encode and shorten
}

function findPasswordElement(){
    return(document.querySelector('input[type="password"]'));
}

function findPassword(element){
    return(element.value);
}

function sendRequest(statusCode) {
    if(statusCode == 1){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ statusCode: statusCode }, function (response) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(receiveMessage(response));
        }
      });
    });
    } else if(statusCode == 2){
        return new Promise((resolve, reject) => {
          chrome.runtime.sendMessage({ statusCode: statusCode, hostName : window.location.host }, function (response) {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(receiveMessage(response));
            }
          });
        });
    }
  }
  

function receiveMessage(response){
    if(response.success){
        return(response.message);
    }else{
        return(-1);
    }
}

async function replacePassword(){
  if(passwordElement == null){
    passwordElement = findPasswordElement()
  }
  if(passwordElement != null){
    var password = findPassword(passwordElement);
    let salt, userId;
    try{
      salt = await sendRequest(2);
    }catch (e){
      console.log(e);
    }
    try{
      userId = await sendRequest(1);
    }catch(e){
      console.log(e);
    }
    const hashString = password + userId + salt;
    const newPassword = hashCode(hashString);
    console.log("New Password Generated: " + newPassword);
    passwordElement.value = newPassword;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "replacePassword") {
    replacePassword();
  }
});


var passwordElement = findPasswordElement();