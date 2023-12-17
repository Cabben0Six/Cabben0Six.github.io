function mainLink() {
    window.location.href = "index.html"
}

function newsLink() {
    window.location.href = "news.html"
}

function contactLink() {
    window.location.href = "contact.html"
}

let curImg = 0;

function changeImage() {
    curImg+= 1;
    switch(curImg) {
        case 1:
            document.getElementById("blegh").src = "i/firefight2.jpg";
            break;
        case 2:
            document.getElementById("blegh").src = "i/firefight4.jpg";
            break;
        default:
            curImg = 0;
            document.getElementById("blegh").src = "i/firefight.webp";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }