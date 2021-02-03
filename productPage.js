var imgLibrary = []
var auction = false;
var canReply = false;
var description;
var productInfo1;
var productInfo2;
var productName;
var productPrice;
var currSlideIndex = 1;
var questionIndex = 0;

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
    db.collection("products").doc(productId).collection("Messages").orderBy("questionNum")
    .onSnapshot(snapshot => {
        let allQuestions = document.getElementById("question_answer") 
        snapshot.docChanges().forEach(change => {
            // if (change.type === "added"){
            //     console.log("bla blaa blaaa ")
            //     // console.log(canReply)
            // }
            if(change.type === "modified"){
                console.log("imedia araa")
                makeReply(change.doc.id, change.doc.data().answer)
            }else{
            //console.log(doc.id, " => ", doc.data().question);
                console.log("override?")
                questionIndex++
                let question = change.doc.data().question
                let answer = change.doc.data().answer
                let conversationPart = document.createElement("div")
                conversationPart.className = "question_box"
                conversationPart.id = change.doc.id
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
                    console.log("this is an answer:")
                    let answerLabel = document.createElement("h3")
                    let answerText = document.createElement("p")
                    answerLabel.innerHTML = "Answer: "
                    answerText.innerHTML = answer
                    answerDiv.appendChild(answerLabel)
                    answerDiv.appendChild(answerText)
                }else if (canReply){
                    console.log("this is an reply:")
                    let myReply = document.createElement("a")
                    myReply.className = "reply"
                    // myReply.id = ""
                    myReply.href = "javascript:void(0);"
                    myReply.onclick = () => { replyQuestion(change.doc.id, productId); }
                    myReply.innerHTML = "Reply"
                    answerDiv.appendChild(myReply)
                }

                conversationPart.appendChild(questionDiv)
                conversationPart.appendChild(answerDiv)
                allQuestions.appendChild(conversationPart)
                //assignListener(db , productId, doc.id)
        }
        });
        
    });
}

function makeReply(docId, answer){
    let conversationPart = document.getElementById(docId)
    let ownerAnswer = conversationPart.getElementsByClassName("answer")[0]
    let reply = ownerAnswer.getElementsByClassName("reply")[0]
    reply.parentNode.removeChild(reply)
    let answerLabel = document.createElement("h3")
    let answerText = document.createElement("p")
    answerLabel.innerHTML = "Answer: "
    answerText.innerHTML = answer
    ownerAnswer.appendChild(answerLabel)
    ownerAnswer.appendChild(answerText)
        //let ownerAnswer = conversationPart.getElementsByTagName("p")
        //ownerAnswer.innerHTML = doc.data().answer
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

function replyQuestion(id, productID){
    let currentQuestion = document.getElementById(id)
    let repButton = currentQuestion.getElementsByClassName("answer")[0]
                    .getElementsByClassName("reply")[0]
    let inputContainer = document.createElement("div")
    inputContainer.className = "reply_container"
    let inputField = document.createElement("input")
    //inputField.className = "reply_input"
    let sendButton = document.createElement("button")
    sendButton.innerHTML = "Send"
    sendButton.onclick = () => { sendReply(id, productID, inputField.value); }
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

function sendReply(id, productID, response){
    console.log("send answer")
    let db = firebase.firestore();
    db.collection("products").doc(productID).collection("Messages").doc(id)
    .update({
        answer: response
    }).then(() => {
        let currentQuestion = document.getElementById(id)
        let replyDiv = currentQuestion.getElementsByClassName("reply_container")[0]
        replyDiv.parentNode.removeChild(replyDiv)
        markQuestionAnswered(db, productID)
    })
}


function sendQuestion(){
    var db = firebase.firestore();
    var queryString = decodeURIComponent(window.location.search);
    let productId =  queryString.substring(11);
    let currQuestion = document.getElementsByClassName("askOrAnswer")[0].getElementsByTagName("input")[0]
    db.collection("products").doc(productId).collection("Messages").add({
        question: currQuestion.value,
        questionNum: questionIndex
    }).then(() => {
        document.getElementsByClassName("question_container")[0].scrollBy(0, 100)
        currQuestion.value = ""
        notifyOwner(db, productId)
    })
}


function notifyOwner(db, productID){
    let myUser = db.collection("users").where("myProducts", "array-contains", String(productID));
    //let messageRef = myUser.collection("myMessages").doc(productID)
    myUser.get()
    .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
            let messageRef = db.collection("users").doc(doc.id).collection("myMessages").doc(productID)
            messageRef.get()
            .then((docSnapshot) => {
                if(docSnapshot.exists){
                    console.log("update")
                    messageRef.get().then((doc) =>{
                        messageRef.update({
                            questionsLeft: doc.data().questionsLeft + 1
                        })
                    });
                }else{
                    console.log("creating")
                    messageRef.set({
                        productName: productName,
                        questionsLeft: 1
                    })
                }
            })
        })
        
    })
}

function markQuestionAnswered(db, productID){
    let myUser = db.collection("users").where("myProducts", "array-contains", String(productID));
    //let messageRef = myUser.collection("myMessages").doc(productID)
    myUser.get()
    .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
            let messageRef = db.collection("users").doc(doc.id).collection("myMessages").doc(productID)
            messageRef.get()
            .then((doc) => {
                if(doc.data().questionsLeft == 1){
                    messageRef.delete()
                }else{
                    messageRef.update({
                        questionsLeft: doc.data().questionsLeft - 1
                    })
                }
            })
        })
    })
}
