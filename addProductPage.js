
var categoryList = [
    {name: "CPU"}, {name: "GPU"}, {name: "Motehrboard"},
    {name: "RAM"}, {name: "PSU"}, {name: "Case"},
    {name: "Cooling"}, {name: "Monitor"}, {name: "Other"}
    ];

window.addEventListener("DOMContentLoaded", function() {
    //let df = new DocumentFragment()
    let categoriesContainer = document.createElement("div");
    categoriesContainer.classList.add("container")
    //df.appendChild(categoriesContainer)

    categoryList.forEach(c => {
        let butt = document.createElement("button");
        butt.textContent = c.name;
        butt.classList.add("cat-button");
        categoriesContainer.appendChild(butt);
    });

    document.getElementById("category-page").appendChild(categoriesContainer);
});


