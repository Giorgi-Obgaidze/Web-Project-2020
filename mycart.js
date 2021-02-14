
var cartItems = []
var containerIDs = []
var userId = ""

window.addEventListener("DOMContentLoaded", function () {
    var db = firebase.firestore()
    console.log("check user")
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            userId = user.uid
            createList(myUserId, db)
        }
    });
})


function createList(userID, db){
    db.collection("users").doc(userID)
    .get().then(function(doc) {
        let arr = doc.data().cart
        if (arr != null) {
        doc.data().cart.map((item) => {
            cartItems.push(item)
        })
    }
    }).then(() => {
        if(cartItems.length > 0){
            displayList(db)
        }else{
            document.getElementsByClassName("buy__btn")[0].style.display = "none"
        }
    }) 
}


function displayList(db){
    document.getElementById("cartWarning").style.display = "none"
    let shoppingCart = document.getElementsByClassName("my__list")[0]
    var itemCount = 0
    db.collection("products").get().then((querrySnapshot) => {
        querrySnapshot.forEach((doc) => {
            if (cartItems.includes(doc.id)){
                let singleItem = document.createElement("div")
                singleItem.className = "cart__item"
                itemId = "item" + itemCount
                itemCount++
                singleItem.id = itemId
                containerIDs.push(itemId)
                shoppingCart.appendChild(singleItem)
                singleItem.appendChild(create("div", "<span class=\"delete-btn\" id ="+ doc.id +">&times;</span>", "btns"))
                singleItem.appendChild(create("div", "<img src='"+doc.data().ImgUrls+"'>", "image"))
                singleItem.appendChild(create("div", "<span>"+ doc.data().ProductName +"</span>", "description"))
                singleItem.appendChild(create("div", "Price: $" + doc.data().ProductPrice, "totalPrice"))
            }
        })
    }).then(() => {
        var i;
        for (i = 0; i < cartItems.length; i++) {
            console.log("containerId: " + containerIDs[i])
            console.log("cart item: " + cartItems[i])
            let currContainer = containerIDs[i]
            let currItem = cartItems[i]
            document.getElementById(cartItems[i]).onclick = () => {removeFromCart(currItem, currContainer, db);}
        }
        
    })
}

function removeFromCart(docId, itemId, db){
    console.log("clicked " + itemId)
    console.log("tring to remove element from array " + docId)
    db.collection("users").doc(userId).update({
        cart: firebase.firestore.FieldValue.arrayRemove(docId)
    }).then(() =>{
        console.log("removing " + itemId)
        notWantedItem = document.getElementById(itemId);
        notWantedItem.parentNode.removeChild(notWantedItem)
    }).then(() =>{
        db.collection("users").doc(userId)
        .get().then((doc) => {
            if(doc.data().cart.length == 0){
                document.getElementById("cartWarning").style.display = "block"
                document.getElementsByClassName("buy__btn")[0].style.display = "none"
            }
        })
    }).catch((error) => {
            console.error("Error removing document: ", error);
        });
}

function create(tag, htmlText, className) {
    let elem = document.createElement(tag);
    elem.innerHTML = htmlText;
    elem.classList.add(className);
    return elem;    
};


function buyItems() {
    let db = firebase.firestore()
    var i;
    for (i = 0; i < cartItems.length; i++) {
        let cartItemId = cartItems[i]
        let cartContainerId = containerIDs[i]
        db.collection("products").doc(cartItems[i]).delete().then(() => {
            console.log("Document successfully deleted!");
            removeFromCart(cartItemId, cartContainerId, db)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });        
    }
    document.getElementsByClassName("buy__btn")[0].style.display = "none"
}