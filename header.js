

function closeSignInForm(){
    document.getElementById("sign-in").style.display = "none"
}

function openSignInForm(buttonId){
    if (String(buttonId).localeCompare("sign-in") == 0) {
        document.getElementById("title").innerHTML = "Sign In";
        document.getElementById("username").style.display = "none"
        document.getElementById("usernameLabel").style.display = "none"
        document.getElementById("sign-in").style.display = "block"
    }else if (String(buttonId).localeCompare("sign-up") == 0){
        document.getElementById("title").innerHTML = "Sign Up";
        document.getElementById("username").style.display = "block"
        document.getElementById("usernameLabel").style.display = "block"
        document.getElementById("sign-in").style.display = "block"
    }
}