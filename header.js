

function closeSignInForm(){
    document.getElementById("sign-in").style.display = "none"
}

function openSignInForm(buttonId){
    if (String(buttonId).localeCompare("sign-in") == 0) {
        document.getElementById("title").innerHTML = "Sign In"
        document.getElementById("username").style.display = "none"
        document.getElementById("usernameLabel").style.display = "none"
        document.getElementById("sign-in").style.display = "block"
        document.getElementById("submit_but").innerHTML = "Sign In"
        document.getElementById("submit_but").onclick = signInFunction
    }else if (String(buttonId).localeCompare("sign-up") == 0){
        document.getElementById("title").innerHTML = "Sign Up"
        document.getElementById("username").style.display = "block"
        document.getElementById("usernameLabel").style.display = "block"
        document.getElementById("sign-in").style.display = "block"
        document.getElementById("submit_but").innerHTML = "Sign Up"
        document.getElementById("submit_but").onclick = signUpFunction
    }
}

function signInFunction(){
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value

    if(email != "" && password != ""){
        var trySignIn = firebase.auth().signInWithEmailAndPassword(email, password)

        trySignIn.catch(function(error){
            var warning = error.code
            var errorMessage = error.message
            console.log(warning)
            window.alert(errorMessage)
        });
        console.log("login test")
    }else{
        window.alert("Please fill out all fields.")
    }
}

function signUpFunction(){
    console.log("sign up")
}


