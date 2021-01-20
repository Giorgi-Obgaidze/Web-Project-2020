var pList = [
    {name: "Item A", img:"RTX-3070.jpg", price: 690.9,
    desc: "2k gaming"},
    {name: "Item B", img:"RTX-3080.png", price: 1200.9,
    desc: "4k gaming"},
    {name: "Item C", img:"RTX-3090.jpg", price: 12300.45,
    desc: "8k gaming"},
    ];

var searchedProducts = [];
    
window.addEventListener("DOMContentLoaded", function () {
    console.log("start the page")
    searchProduct()
    console.log("search ended");
});

function searchProduct(){
    var queryString = decodeURIComponent(window.location.search);

    let userInput = queryString.substring(11); 
    console.log(userInput);
    var db = firebase.firestore();

    db.collection('products')
    .orderBy('ProductName')
    .startAt(userInput)
    .endAt(userInput + '\uf8ff').get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            console.log("curr doc id :" + doc.id);
            searchedProducts.push(doc.id);
        });
        console.log("finished");
        console.log(searchedProducts[0]);
        displayProducts();
        // window.location.replace("searchPage.html");
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
    console.log("first element: " + searchedProducts[0]);
    searchedProducts.forEach(p => {
        console.log(p);
        var db = firebase.firestore();
        db.collection("products").doc(p)
        .get().then(function(doc){
            if (doc.exists) {
                console.log("Document data:", doc.data().ProductName);
                let segment = document.createElement("div");
                segment.classList.add("product")
                df.appendChild(segment)
                segment.appendChild(create("div", "<img src ='"+doc.data().ImgUrls+"'>", "pImg"));
                segment.appendChild(create("div", doc.data().ProductName, "pName"));
                segment.appendChild(create("div", "$" + doc.data().ProductPrice, "pPrice"));
                segment.appendChild(create("div", doc.data().Description, "desc"));
            } else {
                console.log("No such document!");
            }
        }).then(function() {
            console.log("done done");
            document.getElementById("product-list").appendChild(df);
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    });
}