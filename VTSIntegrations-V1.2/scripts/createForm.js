fetch("data.json")
    .then((response) => response.json())
    .then((json) => generateForm(json))
    .catch((error) => {
        console.error("Error fetching JSON:", error);
        document.body.appendChild(document.createElement("h3"));
        document.querySelector("h3").style.padding = "50px";
        document.querySelector("h3").innerHTML = "Error: Could not load Diagram!";
    });

function generateForm(json) {
    divi = document.createElement("div");
    divi.id = "AllMyChecks";
    document.body.appendChild(divi);
    
    let p0 = document.createElement("p");
    p0.innerHTML = "Products:"; p0.className = "boldme"; p0.style.margin = 0; p0.id = "theProductsTitle";
    divi.appendChild(p0);
    
    divi.appendChild(document.createElement("form"));
    let form = document.querySelector("form");
    
    p0.addEventListener("click", function() {
        if (form.style.maxHeight) form.style.maxHeight = null;
        else form.style.maxHeight = form.scrollHeight - 10 + "px";
        p0.classList.toggle("theProductsIsOn");
    });

    let extraCheckmarks = [];
    let leFirstChecks;
    let curveValue;
    let directionValue = "TB";
    let strictExceps = false;

    for (i in json) {
        checkCreation(form, json[i], false, true);
        for (j in json[i].integrations) {
            let test = Array.from(json).findIndex(e => e.product === json[i].integrations[j].product);
            if (test === -1) {
                let test2 = extraCheckmarks.findIndex(e => e.product === json[i].integrations[j].product);
                if (test2 === -1)
                    extraCheckmarks.push(json[i].integrations[j]);
            }
        }
    }
    if (extraCheckmarks.length !== 0) {
        for (i in extraCheckmarks) {
            checkCreation(form, extraCheckmarks[i], false, false)
        }
    }

    function checkCreation(parent, inner, myCheck, doICare, popupIDs, pettyID, strictID) {
        let l = document.createElement("label");
        l.className = "container";
        if (doICare == undefined)
            {l.innerHTML = inner; l.classList.add("justneedtinyoffset")}
        else if (doICare && json[i].title !== undefined && json[i].title !== "")
            l.innerHTML = inner.title;
        else
            l.innerHTML = inner.product;
        parent.appendChild(l);

        let e = document.createElement("input");
        e.type = "checkbox";
        if (popupIDs) {e.id = "Popup";}
        else if (inner.product !== undefined) {e.id = inner.product;}
        else {e.id = inner}
        e.checked = myCheck;
        l.appendChild(e);
        
        let s = document.createElement("span");
        s.className = "checkmark";
        if (pettyID !== undefined) s.id = "check" + inner;
        l.appendChild(s);

        if (popupIDs) {
            l.addEventListener("mouseenter", function() {dontDelete = true;});
            l.addEventListener("mouseleave", function() {dontDelete = false;});

            e.onchange = function() {
                if (document.getElementById("infoBox") !== null)
                    document.getElementById("infoBox").classList.toggle("stationaryBox", this.checked);

                imStationary = this.checked;
            };
        }

        if (strictID) {
            e.onchange = function() {
                strictExceps = e.checked;
                
                if (leFirstChecks === undefined)
                    generateHTML(json, [], curveValue, directionValue, strictExceps);
                else
                    generateHTML(json, leFirstChecks, curveValue, directionValue, strictExceps);
            };
        }
    }

    form.addEventListener("click", function() {        
        let theChecks = [];

        form.childNodes.forEach(child => {
            if (child.childNodes[1].type === "checkbox") {
                if (child.childNodes[1].checked)
                    theChecks.push(child.childNodes[1].id);
            }
        });

        if (leFirstChecks === undefined)
            leFirstChecks = theChecks;

        if (theChecks.length !== leFirstChecks.length) {
            leFirstChecks = theChecks;
            generateHTML(json, theChecks, curveValue, directionValue, strictExceps);
        }
    });

    divi.appendChild(document.createElement("hr"));
    let p1 = document.createElement("p");
    p1.innerHTML = "Diagram Style:"; p1.className = "boldme"; p1.classList.add("Titles"); p1.style.margin = 0;
    divi.appendChild(p1);

    let selectCurve = document.createElement("select");
    selectCurve.id = "curves"; selectCurve.title = "Style";
    const curveStyles = ["basis", "linear", "monotoneX", "monotoneY"];
    curveStyles.forEach(c => createOption(c, selectCurve));

    function createOption(s, selection, maybevalue) {
        let o = document.createElement("option");
        if (maybevalue !== undefined) {o.innerHTML = s; o.value = maybevalue;}
        else o.innerHTML = o.value = s;
        selection.appendChild(o);
    }
    
    selectCurve.onchange = function() {
        curveValue = document.getElementById("curves").value;

        if (leFirstChecks === undefined)
            generateHTML(json, [], curveValue, directionValue, strictExceps);
        else
            generateHTML(json, leFirstChecks, curveValue, directionValue, strictExceps);
    };
    divi.appendChild(selectCurve);

    let selectDirection = document.createElement("select");
    selectDirection.id = "direction"; selectDirection.title = "Direction";
    createOption("Top to Bottom", selectDirection, "TB"); createOption("Left to Right", selectDirection, "LR");

    selectDirection.onchange = function() {
        directionValue = document.getElementById("direction").value;

        if (leFirstChecks === undefined)
            generateHTML(json, [], curveValue, directionValue, strictExceps);
        else
            generateHTML(json, leFirstChecks, curveValue, directionValue, strictExceps);
    };

    let p2 = document.createElement("p");
    p2.innerHTML = "Diagram Direction:"; p2.className = "boldme"; p2.classList.add("Titles"); p2.style.margin = 0;
    divi.appendChild(p2);

    divi.appendChild(selectDirection);
    divi.appendChild(document.createElement("hr"));

    checkCreation(divi, "Active", true, undefined, undefined, true); checkCreation(divi, "Ongoing", true, undefined, undefined, true); checkCreation(divi, "Planned", true, undefined, undefined, true);
    arrowCheckboxes("Active", "green"); arrowCheckboxes("Ongoing", "orange"); arrowCheckboxes("Planned", "red"); 
    divi.appendChild(document.createElement("hr"));
    
    checkCreation(divi, "Strictly Select Products", false, undefined, undefined, undefined, true);
    checkCreation(divi, "Stationary Pop-Up", false, undefined, true);
    
    function arrowCheckboxes(box, search) {
        let b = document.getElementById(box);
        b.onchange = function() {
            let doc = Array.from(document.getElementsByClassName("edgePaths")[0].childNodes);
            let f = document.querySelectorAll("form input");
            let f2 = Array.from(f).filter(l => !l.checked);
            for (i in doc) {
                if (doc[i].id.charAt(doc[i].id.length - 1) !== "e") {
                    break;
                }
                
                if (doc[i].classList.contains(search)) {
                    let d = document.getElementById(String(doc[i].id).slice(0, doc[i].id.length - 1));
                    d.classList.toggle("Deactivated", !b.checked);
                    doc[i].classList.toggle("Deactivated", !b.checked);
                }
            }
            
            f2.forEach(q => {
                let myDoc = doc.filter(a => a.classList.contains("LE-" + Array.from(f).findIndex(w => w === q))).concat(doc.filter(a => a.classList.contains("LS-" + Array.from(f).findIndex(w => w === q))));
                if (myDoc.length !== 0) {
                    let my2ndDoc = myDoc.filter(a => a.classList.contains("Deactivated"));
                    let text = "[id^=flowchart-" + Array.from(f).findIndex(w => w === q) + "-]";
                    let n = document.querySelector(text);
                    
                    if (myDoc.length === my2ndDoc.length) {
                        n.classList.toggle("Deactivated", true);
                    }
                    else {
                        n.classList.toggle("Deactivated", false);
                    }
                }
            });
        }
    }
    
    form.style.maxHeight = form.scrollHeight - 10 + "px";
    form.style.resize = "vertical";
    form.style.overflowY = "scroll";
    generateHTML(json, [], curveValue, directionValue, strictExceps);
}