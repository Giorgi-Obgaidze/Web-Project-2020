
var searchedProducts = [];
    
window.addEventListener("DOMContentLoaded", function () {
    searchProduct()
});

function searchProduct(){
    var queryString = decodeURIComponent(window.location.search);

    let userInput = queryString.substring(11); 
    var db = firebase.firestore();

    db.collection('products')
    .orderBy('ProductName')
    .startAt(userInput)
    .endAt(userInput + '\uf8ff').get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            searchedProducts.push(doc.id);
        });
        displayProducts();
    })
    .catch(function(error){
        console.log("Error getting documents: ", error);
    });
    

}

function displayProducts(){
    let df = new DocumentFragment()
    function create(tag, htmlText, className) {
        let elem = document.createElement(tag);
        elem.innerHTML = htmlText;
        elem.classList.add(className);
        return elem;    
    };
    searchedProducts.forEach(p => {
        var db = firebase.firestore();
        db.collection("products").doc(p)
        .get().then(function(doc){
            if (doc.exists) {
                let segment = document.createElement("div");
                segment.classList.add("product")
                df.appendChild(segment)
                segment.appendChild(create("div", "<img src='"+doc.data().ImgUrls+"'>", "pImg"));
                segment.appendChild(create("div", "<a href='productPage.html?productId="+p+"'>"+doc.data().ProductName+"</a>", "pName"));
                segment.appendChild(create("div", "$" + doc.data().ProductPrice, "pPrice"));
                segment.appendChild(create("div", doc.data().Description, "desc"));
            } else {
                console.log("No such document!");
            }
        }).then(function() {
            document.getElementById("product-list").appendChild(df);
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    });
}