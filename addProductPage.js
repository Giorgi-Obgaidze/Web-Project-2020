var isAuction = false;


var categoryList = [
    {name: "CPU"}, {name: "GPU"}, {name: "Motehrboard"},
    {name: "RAM"}, {name: "PSU"}, {name: "Case"},
    {name: "Cooling"}, {name: "Monitor"}, {name: "Other"}
    ];

var modal = document.getElementById("productForm__window");

window.onclick = function(event){
    if(event.target == modal){
        modal.style.display = "none";
    }
}

window.addEventListener("DOMContentLoaded", function() {
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
            document.getElementById("productForm__window").style.display = "block";
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
    createDescriptionInputField();
    createPriceField();

}



