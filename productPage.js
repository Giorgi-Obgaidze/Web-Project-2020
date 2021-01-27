var imgLibrary = []
var auction = false;
var canReply = false;
var description;
var productInfo1;
var productInfo2;
var productName;
var productPrice;
var currSlideIndex = 1;

window.addEventListener("DOMContentLoaded", function () {
    var db = firebase.firestore();
    var queryString = decodeURIComponent(window.location.search);
    let productId =  queryString.substring(11);
    console.log(productId);
    canUserReply(db, productId)

});


function getProductInfo(db, productId){
    loadAnswers(db, productId)
    db.collection("products").doc(productId)
    .get().then(function(doc){
        let productData = doc.data();
        // console.log(productData);
        imgLibrary = productData.ImgUrls;
        auction = productData.Auction;
        description = productData.Description;
        productInfo1 = productData.ProductInfo1;
        productInfo2 = productData.ProductInfo2;
        productName = productData.ProductName;
        productPrice = productData.ProductPrice;
    }).then(function(){
        document.getElementById("product-name").innerHTML = productName;
        document.getElementById("product_price").innerHTML = productPrice;
        document.getElementById("product_details").innerHTML = description;
        if(auction){
            document.getElementById("bid_container").style.display = "block";
        }else{
            document.getElementById("buy_btn").style.display = "block";
        }
        makeSlideshow();
        
    });
}

function loadAnswers(db, productId){
    db.collection("products").doc(productId).collection("Messages")
    .get().then(querySnapshot => {
        let allQuestions = document.getElementById("question_answer") 
        querySnapshot.forEach(doc => {
            // console.log(doc.id, " => ", doc.data().question);
            let question = doc.data().question
            let answer = doc.data().answer
            let conversationPart = document.createElement("div")
            conversationPart.className = "question_box"
            conversationPart.id = doc.id
            let questionDiv = document.createElement("div")
            let questionLabel = document.createElement("h3")
            let questionText = document.createElement("h5")
            questionDiv.className = "question"
            questionLabel.innerHTML = "Question: "
            // questionText.id = "question"
            questionText.innerHTML = question
            questionDiv.appendChild(questionLabel)
            questionDiv.appendChild(questionText)

            let answerDiv = document.createElement("div")
            answerDiv.className = "answer"
            if(answer != null){
                let answerLabel = document.createElement("h3")
                let answerText = document.createElement("p")
                answerLabel.innerHTML = "Answer: "
                answerText.innerHTML = answer
                answerDiv.appendChild(answerLabel)
                answerDiv.appendChild(answerText)
            }else if (canReply){
                let myReply = document.createElement("a")
                myReply.className = "reply"
                // myReply.id = ""
                myReply.href = "#"
                myReply.onclick = () => { replyQuestion(doc.id); }
                myReply.innerHTML = "Reply"
                answerDiv.appendChild(myReply)
            }

            conversationPart.appendChild(questionDiv)
            conversationPart.appendChild(answerDiv)
            allQuestions.appendChild(conversationPart)
        });
    });
}

function makeSlideshow(){
    imageContainer = document.getElementsByClassName('images');
    myDots = document.createElement('div');
    myDots.setAttribute('id', 'dot');
    for(var i = 0; i < imgLibrary.length; i++){
        currSlide = document.createElement('div');
        currSlide.className = "slide";
        currImage = document.createElement('img');
        currImage.src = imgLibrary[i];
        currImage.className = "product__image";
        myDot = document.createElement('span');
        myDot.className = "my_dot";
        var j = i + 1;
        myDot.setAttribute('onclick', 'currentSlide( " '+j+' " )');
        myDots.appendChild(myDot);
        currSlide.appendChild(currImage);
        imageContainer[0].appendChild(currSlide);
    }
    console.log("all images are ready");
    imageContainer[0].appendChild(myDots);
    showFirstSlide();
}

function showFirstSlide(){
    showMySlide(currSlideIndex);
}

function nextSlide(n){
    var k = parseInt(n)
    showMySlide(currSlideIndex += k);
}

function currentSlide(n){
    var k = parseInt(n)
    showMySlide(currSlideIndex = k);
}

function showMySlide(n){
    var allImages = document.getElementsByClassName("slide");
    var allDots = document.getElementsByClassName("my_dot");
    if(n > allImages.length){
        currSlideIndex = 1;
    }
    if(n < 1){
        currSlideIndex = allImages.length; 
    }
    for(var i = 0; i < allImages.length; i++){
        allImages[i].style.display = "none";
    }
    for(var i = 0; i < allDots.length; i++){
        allDots[i].className = allDots[i].className.replace(" active", "");
    }
    allImages[currSlideIndex - 1].style.display = "block"
    allDots[currSlideIndex - 1].className += " active";

}

function canUserReply(db, productId){
    return firebase.auth().onAuthStateChanged(function(user){
        canReply = false
        if(user){
            db.collection("users").doc(user.uid)
            .get().then(function(doc){
            if(doc.data().myProducts.includes(productId)){
                canReply = true
            }else{
                canReply = false
            }
        }).then(() => {
            console.log("gather info")
            getProductInfo(db, productId);
        })
        }else{
            console.log("gather info")
            getProductInfo(db, productId);
        }
    })
}

function replyQuestion(id){
    let currentQuestion = document.getElementById(id)
    let repButton = currentQuestion.getElementsByClassName("answer")[0]
                    .getElementsByClassName("reply")[0]
    let inputContainer = document.createElement("div")
    inputContainer.className = "reply_container"
    let inputField = document.createElement("input")
    //inputField.className = "reply_input"
    let sendButton = document.createElement("button")
    sendButton.innerHTML = "Send"
    
    inputContainer.appendChild(inputField)
    inputContainer.appendChild(sendButton)
    currentQuestion.appendChild(inputContainer)
    repButton.removeAttribute("onclick")
    repButton.onclick = () => { closeReply(id); }
}

function closeReply(id){
    let currentQuestion = document.getElementById(id)
    let replyDiv = currentQuestion.getElementsByClassName("reply_container")[0]
    let repButton = currentQuestion.getElementsByClassName("answer")[0]
                    .getElementsByClassName("reply")[0]
    replyDiv.parentNode.removeChild(replyDiv)
    repButton.removeAttribute("onclick")
    repButton.onclick = () => { replyQuestion(id); }
}

