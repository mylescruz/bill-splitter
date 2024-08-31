const hideWelcome = function() {
    document.querySelector(".welcome").style.display = "none";
};

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("even-btn").addEventListener("click", () => {
        console.log("Even");
        document.querySelector(".even-split").style.display = "flex";
        hideWelcome();
    });
    document.getElementById("item-btn").addEventListener("click", () => {
        console.log("Item");
        document.querySelector(".item-split").style.display = "flex";
        hideWelcome();
    });
});