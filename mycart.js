
var cartItems = []
var userId = ""

window.addEventListener("DOMContentLoaded", function () {
    var db = firebase.firestore()
    console.log("check user")
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            userId = user.uid
            createList(myUserId, db)
        }else{
            
        }
    });
})


function createList(userID, db){
    db.collection("users").doc(userID)
    .get().then(function(doc) {
        let arr = doc.data().cart
        if (arr != null) {
        doc.data().cart.map((item) => {
            console.log(item)
            cartItems.push(item)
        })
    }
    }).then(() => {
        displayList(db)
    }) 
}


function displayList(db){
    let shoppingCart = document.getElementsByClassName("my__list")[0]
    var itemCount = 0
    db.collection("products").get().then((querrySnapshot) => {
        querrySnapshot.forEach((doc) => {
            if (cartItems.includes(doc.id)){
                let singleItem = document.createElement("div")
                singleItem.className = "cart__item"
                itemId = "item" + itemCount
                singleItem.id = itemId
                shoppingCart.appendChild(singleItem)
                singleItem.appendChild(create("div", "<span class=\"delete-btn\" id ="+ doc.id +">&times;</span>", "btns"))
                singleItem.appendChild(create("div", "<img src='"+doc.data().ImgUrls+"'>", "image"))
                singleItem.appendChild(create("div", "<span>"+ doc.data().ProductName +"</span>", "description"))
                singleItem.appendChild(create("div", "Price: $" + doc.data().ProductPrice, "totalPrice"))
                document.getElementById(doc.id).onclick = () => { removeFromCart(doc.id, itemId, db);}
                itemCount++
            }
        })
    })
}

function removeFromCart(docId, itemId, db){
    console.log("clicked")
    // db.collection("products").doc(docId).delete().then(() =>{
    //     console.log("removing ")
    //     notWantedItem = documnet.getElementById(itemId);
    //     notWantedItem.parentNode.removeChild(notWantedItem)
    // }).then(() => {
    console.log("tring to remove element from array")
    db.collection("products").doc(docId).update({
        myProducts: myProducts.filter(product => product.id !== docId)
    })
    //});
    // .catch((error) => {
    //     window.alert("Error removing document: ", error);
    // });
}

function create(tag, htmlText, className) {
    let elem = document.createElement(tag);
    elem.innerHTML = htmlText;
    elem.classList.add(className);
    return elem;    
};