
var myUserId;

function checkUserStatus(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            myUserId = user.uid
            wellcomeUser()
        }else{
            wellcomeNewUser()
        }
    });
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
    listenForMessages(user.uid)
    checkTheCart(user.uid)
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
        if( document.getElementById("slash") != null){
            document.getElementById("slash").parentNode.removeChild(document.getElementById("slash"))
        }
    }
}


function wellcomeNewUser(){
    var hoverContainer =  document.getElementById("hoverContainer")
    document.getElementById("hi").style.display = "block"
    document.getElementById("signin").style.display = "block"
    document.getElementById("or").style.display = "block"
    document.getElementById("register").style.display = "block"
    hoverContainer.style.display = "none"
    document.getElementById("sell").style.display = "none"
}

function checkTheCart(userID) {
    let db = firebase.firestore()
    db.collection("users").doc(userID)
    .onSnapshot({
        includeMetadataChanges: true
    },(doc) =>{
        if(doc.data().cart.length == 0){
            document.getElementsByClassName("cartIcon")[0].src = "images/cart.png"
        }else{
            document.getElementsByClassName("cartIcon")[0].src = "images/shopping-cart.png"
        }
    })
}

function listenForMessages(userID) {
    let db = firebase.firestore()
    db.collection("users").doc(userID).collection("myMessages")
    .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            console.log("something changed :" + change.doc.data().questionsLeft)
            if(change.type === "added"){
                document.getElementById("messageIconImage").src = "images/received-message.png"
            }else {
                db.collection('users').doc(userID).collection("myMessages").get().
                then(sub => {
                if (sub.docs.length <= 0) {
                    console.log("subcollection doesn't exists");
                    document.getElementById("messageIconImage").src = "images/message.png"
                }
                }); 
            }
        })
    });
}

function signInFunction(){
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value

    if(email != "" && password != ""){
        var trySignIn = firebase.auth().signInWithEmailAndPassword(email, password)

        trySignIn.then(() => {
            wellcomeUser()
            closeSignInForm()
            console.log("make slash none")
        }).then(() =>{
            location.reload(true);
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
                myProducts: [],
                cart: []
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
        }).then(() =>{
            location.reload(true);
        })
        .catch((error) => {
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
      }).then(() =>{
        location.reload(true);
      })
      .catch((error) => {
            var errorMessage = error.message;
            window.alert(errorMessage);
      });
}

function openMessages(){  
    document.getElementById("messageIconImage").onclick = null
    let db = firebase.firestore()
    var popup = document.getElementsByClassName("mymessages")[0];
    db.collection("users").doc(myUserId).collection("myMessages")
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
                console.log(doc.data().answer)
                let questionDiv = document.createElement("div")
                questionDiv.className = "questionContainer"
                let pLink = document.createElement("a")
                pLink.href = "productPage.html?productId=" + doc.id
                pLink.innerHTML = doc.data().productName
                questionDiv.appendChild(pLink)
                popup.appendChild(questionDiv)
                console.log("loading existing " + doc.id)
        })
    }).then(() => {
        popup.style.display = "inline-block"
    })
}

function closeMessageBox(){
    document.getElementById("messageIconImage").onclick = openMessages
    var popup = document.getElementsByClassName("mymessages")[0];
    popup.style.display = "none"
    var qDivs = popup.getElementsByClassName("questionContainer");
    let bla = qDivs.length
    for (let i = 0; i < bla; i++) {
        console.log(i)
        qDivs[0].parentNode.removeChild(qDivs[0])
    }
}

function checkUserCart() {
    let f = document.getElementById("frm")
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            f.setAttribute("action", "mycart.html")
        }else{
            window.alert("Please Sign in first")
        }
    });
}