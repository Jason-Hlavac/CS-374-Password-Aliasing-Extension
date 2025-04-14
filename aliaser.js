function main(){
    console.log('Hello World!');
    var button = document.createElement("Button");
    button.addEventListener('click', function(){
        console.log(findPassword());
    });
    button.textContent = "Find Password";
    document.body.prepend(button);
};

function findPassword(){
    const passwordElement = document.querySelector('input[type= "password"]');
    return({element: passwordElement, password: passwordElement.value});
}

main();