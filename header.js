
//window.onload = checkUserStatus()


function checkUserStatus(){
    console.log("check user")
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            wellcomeUser()
            console.log("user still here");
        }else{
            wellcomeNewUser()
            console.log("user not here");
        }
    });
    //var user = firebase.auth().currentUser; 
    
   // if(user != null){
        //console.log("user in")
        
    //}
}

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

function wellcomeUser(){
    var user = firebase.auth().currentUser; 
    
    if(user != null){
        var greetUser =  document.getElementById("curr_user")
        greetUser.innerHTML = "Hi " + user.displayName
        var hoverContainer =  document.getElementById("hoverContainer")
        document.getElementById("hi").style.display = "none"
        document.getElementById("signin").style.display = "none"
        document.getElementById("or").style.display = "none"
        document.getElementById("register").style.display = "none"
        hoverContainer.style.display = "inline-block"
        document.getElementById("sell").style.display = "block"
    }
    
    
    // let navBar = document.getElementById("nav_bar")
    // let hoverWindowContainer = document.createElement("div")
    // let hoverWindow = document.createElement("span")
    // let logoutButton = document.createElement("button")
    // logoutButton.type = "button"
    // logoutButton.innerHTML = "Log Out"
    // logoutButton.onclick = signOutFunction
    // hoverWindow.classList.add("hover_window")
    // hoverWindow.appendChild(logoutButton)
    // hoverWindowContainer.classList.add("hover_container")
    // hoverWindowContainer.setAttribute("id", "hoverContainer")
    // hoverWindowContainer.innerHTML = "Hi " + user.displayName
    // hoverWindowContainer.appendChild(hoverWindow)
    // navBar.appendChild(hoverWindowContainer)
}


function wellcomeNewUser(){
    //var greetUser =  document.getElementById("curr_user")
    //greetUser.innerHTML = "Hi " + user.displayName
    var hoverContainer =  document.getElementById("hoverContainer")
    document.getElementById("hi").style.display = "block"
    document.getElementById("signin").style.display = "block"
    document.getElementById("or").style.display = "block"
    document.getElementById("register").style.display = "block"
    hoverContainer.style.display = "none"
    document.getElementById("sell").style.display = "none"
}


function signInFunction(){
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value

    if(email != "" && password != ""){
        var trySignIn = firebase.auth().signInWithEmailAndPassword(email, password)

        trySignIn.then(() => {
            wellcomeUser()
            closeSignInForm()
        })
        .catch(function(error){
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
    var username = document.getElementById("username").value
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value

    if(email != "" && password != "" && username != ""){
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            var db = firebase.firestore();
            db.collection("users").doc(user.user.uid).set({
                myProducts: []
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            return user.user
            .updateProfile({
                displayName: username
            }).then(() => {
                closeSignInForm()
                wellcomeUser()
            })
            .catch(function(error){
                var errorMessage = error.message;
                window.alert(errorMessage);
            });
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
            console.log(errorCode);
        });


    }
}

function signOutFunction(){
    firebase.auth().signOut().then(() => {
        document.getElementById("hi").style.display = "block"
        document.getElementById("signin").style.display = "block"
        document.getElementById("or").style.display = "block"
        document.getElementById("register").style.display = "block"
        document.getElementById("hoverContainer").style.display = "none"
        document.getElementById("sell").style.display = "none"
      }).catch((error) => {
            var errorMessage = error.message;
            window.alert(errorMessage);
      });
}

