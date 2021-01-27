var isAuction = false;
var currUser;
//var imgcount; 
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

    //let df = new DocumentFragment()
    let categoriesContainer = document.createElement("div");
    categoriesContainer.classList.add("container")
    //df.appendChild(categoriesContainer)

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
    radio2 = document.getElementById("radio-two");
    radio2.addEventListener("change", function(){
        let lab = document.getElementById("price_label");
        lab.textContent = "Starting Price";
        radio1.checked = false;
    });
    radio1.addEventListener("change", function(){
        let lab = document.getElementById("price_label");
        lab.textContent = "Price";
        radio2.checked = false;
    });
}

var intelProcessors = [
    {name: "intel core i3-2100"}, {name: "intel core i5-4570"},
    {name: "intel core i7-7700k"}
];

var amdProcessors = [
    {name: "ryzen 3-3100"}, {name: "ryzen 5 3600"},
    {name: "ryzen 7 3700X"}, {name: "fx-8350BE"}
];

var intelSockets = [
    {name:"FCLGA1155"}, {name:"FCLGA1150"},
    {name:"FCLGA1151"}
];

var amdSockets = [
    {name: "AM4"}, {name: "AM3+"}
];



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

 function createSocketSelectBox(){
    var form = document.getElementById("product__form")
    let selectLabel = document.createElement("label");
    selectLabel.setAttribute("for", "select-socket");
    selectLabel.textContent = "Socket"
    let select = document.createElement("select");
    select.setAttribute("id", "select-socket");
    select.setAttribute("name", "select-socket");
    let intelGroup = document.createElement("optgroup");
    intelGroup.label = "Intel Socket"
    let amdGroup = document.createElement("optgroup");
    amdGroup.label = "AMD Socket"
    intelSockets.forEach(i => {
        let opt = document.createElement("option");
        opt.value = i.name;
        opt.innerHTML = i.name;
        intelGroup.appendChild(opt);
    });

    amdSockets.forEach(a => {
        let opt = document.createElement("option");
        opt.value = a.name;
        opt.innerHTML = a.name;
        amdGroup.appendChild(opt);
    });
    select.appendChild(intelGroup);
    select.appendChild(amdGroup);
    form.appendChild(selectLabel)
    form.appendChild(select);
}

function createProcessorSelectBox(){
    var form = document.getElementById("product__form")
    let selectLabel = document.createElement("label");
    selectLabel.setAttribute("for", "select-CPU");
    selectLabel.textContent = "Processor";
    let select = document.createElement("select");
    select.setAttribute("id", "select-CPU");
    select.setAttribute("name", "select-CPU");
    let intelGroup = document.createElement("optgroup");
    intelGroup.label = "Intel CPUs"
    let amdGroup = document.createElement("optgroup");
    amdGroup.label = "AMD CPUs"
    intelProcessors.forEach(i => {
        let opt = document.createElement("option");
        opt.value = i.name;
        opt.innerHTML = i.name;
        intelGroup.appendChild(opt);
    });

    amdProcessors.forEach(a => {
        let opt = document.createElement("option");
        opt.value = a.name;
        opt.innerHTML = a.name;
        amdGroup.appendChild(opt);
    });
    select.appendChild(intelGroup);
    select.appendChild(amdGroup);
    form.appendChild(selectLabel)
    form.appendChild(select);
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
            ProductInfo1: additionalInfo1.value,
            ProductInfo2: additionalInfo2.value,
            Description: description.value,
            ProductPrice: price.value,
            Auction: isAuction,
            ImgUrls: []
        })
        .then(function(docRef) {
            productId = docRef.id;
            console.log(currUser.uid);
            var my_user = db.collection("users").doc(currUser.uid);
            my_user.update({
                myProducts: firebase.firestore.FieldValue.arrayUnion(productId)
            });

        })
        .then(function(){
            console.log("start putting the Image");
            var promises = [];
            for(i = 0; i < images.length; i++){
                var currpromise = new Promise((resolve, reject) => {
                console.log("starting: " + i);
                var uploadTask = firebase.storage().ref('Images/'+ productId + i + ".png").put(images[i]);
                console.log("finish putting the Image");
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
                    'complete': function() {
                    
                    uploadTask.snapshot.ref.getDownloadURL().then(function(url){
                        imgUrl = url;
                        console.log('File available at', url);
                    })
                    .then(function(){
                        console.log("image url:" + imgUrl);
                        var my_product = db.collection("products").doc(productId);
                        my_product.update({
                            ImgUrls: firebase.firestore.FieldValue.arrayUnion(imgUrl)
                        });
                        console.log("uraaaaaaaaa");
                        resolve("done");
                    });
                    }
                }            
                );
            });
                promises.push(currpromise);
            }
            Promise.all(promises).then(function(val) {
                console.log("reload my page" + val);
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

// function sellOption(){
//     let form = document.getElementById("product__form");
//     let container = document.createElement("div");
//     container.setAttribute("class", "buying__option")
//     let radioOne = document.createElement("input");
//     let radioTwo = document.createElement("input");
//     let labelOne = document.createElement("label");
//     let labelTwo = document.createElement("label");
//     labelOne.textContent = "Buy It now";
//     labelTwo.textContent = "Auction";
//     radioOne.setAttribute("type", "radio");
//     radioOne.setAttribute("id", "radio-one");
//     radioOne.setAttribute("name", "buyItNow");
//     radioOne.setAttribute("value", "Buy It Now");


//     radioTwo.setAttribute("type", "radio");
//     radioTwo.setAttribute("id", "radio-two");
//     radioTwo.setAttribute("name", "auction");
//     radioTwo.setAttribute("value", "Auction");
    
//     labelOne.setAttribute("for", "radio-one");
//     labelTwo.setAttribute("for", "radio-two");
//     container.appendChild(radioOne);
//     container.appendChild(radioTwo);
//     form.appendChild(container);
// }


function createForm(){
    //sellOption();
    
    createProductNameInputField();
    createSocketSelectBox();
    createProcessorSelectBox();
    createImageUpload()
    createDescriptionInputField();
    createPriceField();
    createSubmitButton();
    uploadProcess();

}



