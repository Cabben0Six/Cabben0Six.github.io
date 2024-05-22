fetch("data.json")
    .then((response) => response.json())
    .then((json) => generateMap(json))
    .catch((error) => {
        console.error("Error fetching JSON:", error);
        document.body.appendChild(document.createElement("h3"));
        document.querySelector("h3").style.padding = "50px";
        document.querySelector("h3").innerHTML = "Error: Could not load Map!";
    });

var activeOverlay = false;
var dontDeleteYet = false;
var invulnerable = false;

function generateMap(json) {
    let layout = document.getElementById("layout");
    let overlay = document.getElementById("overlay");
    let infobox = document.getElementById("infobox");

    infobox.addEventListener("mouseenter", function() {invulnerable = true});
    infobox.addEventListener("mouseleave", function() {invulnerable = false});

    Array.from(json).forEach(entry => {
        let outerDiv = document.createElement("div");
        let h3 = document.createElement("h3");
        let div = document.createElement("div");
        let ico = document.createElement("img");

        outerDiv.classList.add("shells");
        div.classList.add("apps");
        ico.src = entry.icon;
        ico.alt = "";
        ico.setAttribute("data-title", entry.title);
        h3.innerHTML = entry.title;
        
        layout.appendChild(outerDiv);
        outerDiv.appendChild(h3);
        outerDiv.appendChild(div);
        div.appendChild(ico);

        outerDiv.addEventListener("mouseenter", function() {
            let pos = outerDiv.getBoundingClientRect();
            document.documentElement.style.setProperty("--h3Index", "none");

            if (pos.left < 100)
                document.documentElement.style.setProperty("--xPos", "50px");
            else if (pos.right > window.innerWidth - 100)
                document.documentElement.style.setProperty("--xPos", "-50px");
            else document.documentElement.style.setProperty("--xPos", "0px");

            if (pos.top < 150)
                document.documentElement.style.setProperty("--yPos", "50px");
            else if (pos.bottom > window.innerHeight - 100)
                document.documentElement.style.setProperty("--yPos", "-50px");
            else document.documentElement.style.setProperty("--yPos", "0px");
        });

        outerDiv.addEventListener("mouseleave", function() {
            document.documentElement.style.setProperty("--h3Index", 1);
        });

        outerDiv.addEventListener("click", function() {
            if (!activeOverlay) {
                activeOverlay = true;
                dontDeleteYet = true;
                overlay.style.display = "block";

                let title = document.createElement("h1");
                title.innerHTML = entry.title;
                title.className = "infoText";
                infobox.appendChild(title);
                if (entry.description !== undefined && entry.description !== "") {
                    let desc = document.createElement("p");
                    desc.innerHTML = entry.description;
                    desc.className = "infoText";
                    infobox.appendChild(desc);
                }
                if (entry.code !== undefined && entry.code !== "") {
                    let desc = document.createElement("p");
                    desc.innerHTML = entry.code;
                    desc.className = "infoText";
                    desc.classList.add("smolMargin");
                    desc.style.fontWeight = "bold";
                    infobox.appendChild(desc);
                }
                
                let lastLink;
                if (entry.urls !== undefined && entry.urls.length > 0) {
                    let container = document.createElement("div");
                    container.id = "infoUrls";
                    infobox.appendChild(container);
                    entry.urls.forEach(function(element, idx, array) {
                        let desc = document.createElement("a");
                        desc.innerHTML = element.name;
                        desc.className = "infoText";
                        desc.target = "_blank";
                        if (idx === array.length - 1)
                            lastLink = desc;
                        desc.setAttribute("href", element.url);
                        container.appendChild(desc); 
                    });
                }
                if (entry.imgs !== undefined && entry.imgs.length > 0) {
                    let container = document.createElement("div");
                    container.id = "infoImgs";
                    infobox.appendChild(container);
                    entry.imgs.forEach(element => {
                        let image = document.createElement("img");
                        image.setAttribute("src", element.img);
                        image.setAttribute("data-title", "Display Image");
                        container.appendChild(image);
                    });
                }
                else if (lastLink !== undefined) {
                    lastLink.classList.add("smolMargin");
                }
            }
        });
    });
}

document.onclick = function() {
    if (dontDeleteYet) {
        dontDeleteYet = false;
    }
    else if (activeOverlay && !invulnerable) {
        activeOverlay = false;
        overlay.style.display = "none";
        infobox.replaceChildren();
    }
}