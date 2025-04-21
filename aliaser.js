function main(){
    const password = "iluvcats123";
    var alias = generateAlias(password);

    console.log('Hello World!');
    console.log(UserID.id);
    console.log(alias)

    var button = document.createElement("Button");
    button.addEventListener('click', function(){
        console.log(findPassword());
    });
    button.textContent = "Find Password";
    document.body.prepend(button);


};

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


function findPassword(){
    const passwordElement = document.querySelector('input[type= "password"]');
    return({element: passwordElement, password: passwordElement.value});
}

chrome.identity.getProfileUserInfo(function(UserID) {
    return UserID.id;
  });


main();
