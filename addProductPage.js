var isAuction = false;
var currUser;
var images = [];

var categoryList = [
    {name: "CPU"}, {name: "GPU"}, {name: "Motherboard"},
    {name: "RAM"}, {name: "PSU"}, {name: "Case"},
    {name: "Cooling"}, {name: "Monitor"}, {name: "Other"}
    ];



window.onclick = function(event){
    var modal = document.getElementById("productForm__window");
    if(event.target == modal){
        modal.style.display = "none";
    }
}

window.addEventListener("DOMContentLoaded", function(){
    addRadioListeners();
    createForm();

    let categoriesContainer = document.createElement("div");
    categoriesContainer.classList.add("container")

    categoryList.forEach(c => {
        let butt = document.createElement("button");
        butt.textContent = c.name;
        butt.addEventListener("click", function(){
            firebase.auth().onAuthStateChanged(function(user){
                if(user){
                    currUser = user;
                    imgcount = -1;
                    
                    document.getElementById("productForm__window").style.display = "block";
                }else{
                    window.alert("Please Sign In First");
                }
            });
            
        })
        butt.classList.add("cat-button");
        categoriesContainer.appendChild(butt);
    });

    document.getElementById("category-page").appendChild(categoriesContainer);
});


function addRadioListeners() {
    radio1 = document.getElementById("radio-one");
    radio1.addEventListener("change", function(){
        let lab = document.getElementById("price_label");
        lab.textContent = "Price";
        radio2.checked = false;
    });
}


function createProductNameInputField(){
    let form = document.getElementById("product__form");
    input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "pname");
    label = document.createElement("Label");
    label.htmlFor = "pname";
    label.innerHTML = "Product name"
    form.appendChild(label);
    form.appendChild(input);

}

function createDescriptionInputField(){
    let form = document.getElementById("product__form");
    input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "description");
    label = document.createElement("label");
    label.setAttribute("for", "description");
    label.textContent = "Description"
    form.appendChild(label);
    form.appendChild(input);
}



 function imageSelection(){
     let imgContainer = document.getElementById("img_container");
     document.getElementById("select").onclick = function(e){
        var input = document.createElement('input');
        input.type = 'file';
        var reader;
        input.onchange = e => {
            var files = e.target.files;
            //images = e.target.files;
            reader = new FileReader();
            reader.onload = function(){
                var img = document.createElement('img');
                img.setAttribute("class", "productImg");
                //img.setAttribute("id", "myImg" + imgcount);
                img.src = reader.result;
                imgContainer.appendChild(img);
            }
            //for(i = 0; i < files)
            images.push(files[0]);
            //imgcount++;
            reader.readAsDataURL(files[0]);
        }
        input.click();
     }
 }

 function createImageUpload(){
    let form = document.getElementById("product__form");
    let imgContainer = document.createElement("div");
    let selectButton = document.createElement("button");
    imgContainer.setAttribute("id", "img_container");
    selectButton.setAttribute("id", "select");
    selectButton.innerHTML = "Select Image";

    form.appendChild(imgContainer);
    form.appendChild(selectButton);
    imageSelection();

 }


 function createPriceField(){
    let form = document.getElementById("product__form");
    input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "price");
    label = document.createElement("label");
    label.setAttribute("for", "price");
    label.setAttribute("id", "price_label");
    label.textContent = "Price";
    form.appendChild(label);
    form.appendChild(input);
}


function uploadProcess(){
    var imgName, imgUrl;
    
    document.getElementById("submit_button").onclick = function(){
        let pName = document.getElementById("pname");
        let additionalInfo1 = document.getElementById("select-socket");
        let additionalInfo2 = document.getElementById("select-CPU");
        let description = document.getElementById("description");
        let price = document.getElementById("price");
        var db = firebase.firestore();
        var productId;
        db.collection("products").add({
            ProductName: pName.value,
            Description: description.value,
            ProductPrice: price.value,
            Auction: isAuction,
            ImgUrls: []
        })
        .then(function(docRef) {
            productId = docRef.id;
            var my_user = db.collection("users").doc(currUser.uid);
            my_user.update({
                myProducts: firebase.firestore.FieldValue.arrayUnion(productId)
            });

        })
        .then(function(){
            var promises = [];
            for(i = 0; i < images.length; i++){
                var currpromise = new Promise((resolve, reject) => {
                var uploadTask = firebase.storage().ref('Images/'+ productId + i + ".png").put(images[i]);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
                    'complete': function() {
                    
                    uploadTask.snapshot.ref.getDownloadURL().then(function(url){
                        imgUrl = url;
                    })
                    .then(function(){
                        var my_product = db.collection("products").doc(productId);
                        my_product.update({
                            ImgUrls: firebase.firestore.FieldValue.arrayUnion(imgUrl)
                        });
                        resolve("done");
                    });
                    }
                }            
                );
            });
                promises.push(currpromise);
            }
            Promise.all(promises).then(function(val) {
                location.reload(true);
            });
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
}

function createSubmitButton(){
    let form = document.getElementById("product__form");
    let butContainer = document.createElement("div");
    let submitBut = document.createElement("button");
    submitBut.setAttribute("id", "submit_button");
    submitBut.innerHTML = "Add Product";
    butContainer.setAttribute("class", "but_container");
    butContainer.appendChild(submitBut);
    form.appendChild(butContainer);
}



function createForm(){
    createProductNameInputField();
    createImageUpload()
    createDescriptionInputField();
    createPriceField();
    createSubmitButton();
    uploadProcess();

}



