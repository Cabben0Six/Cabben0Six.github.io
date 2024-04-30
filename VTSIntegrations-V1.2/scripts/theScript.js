var THEJSON = [];

const entryTemplate = "((\"§\"))";
const entrySplit = entryTemplate.indexOf("§");
const half1 = entryTemplate.substring(0, entrySplit);
const half2 = entryTemplate.substring(entrySplit + 1);

const imgString = "<img title=\"£\" src=\"§\"/>";
const imgSplit = imgString.indexOf("£"); const imgSplit2 = imgString.indexOf("§");
const imgHalf1 = imgString.substring(0, imgSplit);
const imgHalf2 = imgString.substring(imgSplit + 1, imgSplit2);
const imgHalf3 = imgString.substring(imgSplit2 + 1);

const defaultIcon = "icons/Visma-Mamut-One-logo.webp";
const strokeColors = {"active": "green", "ongoing": "orange", "not_started": "red"};

var dontDelete = false;
var boxPopup = false;
var imStationary = false;

let firstCreation = false;
var divi;

document.onclick = function() {
    if (document.getElementById("infoBox") !== null) {
        if (!boxPopup) {
            boxPopup = true;
        }
        else if (!dontDelete) {
            document.getElementById("infoBox").remove();
            boxPopup = false;
        }
    }
}

function generateHTML(json, exceptions, newCurve, newDirection, strictExceptions) {
    if (!firstCreation) {
        divi = document.createElement("div");
        divi.id = "myOneDiagram";
        document.body.appendChild(divi);
        firstCreation = true;
    }
    
    if (document.querySelector("pre") !== null)
            document.querySelector("pre").remove();
    
    THEJSON = json;
    const diagram = document.createElement("pre");
    diagram.className = "mermaid";
    diagram.setAttribute("style", "opacity: 0;");

    if (newCurve === undefined) newCurve = "basis";
    diagram.innerHTML = "\n" + "%%{init: {\"flowchart\": {\"curve\": \"" + newCurve + "\"}}}%%" + "\n" + "graph " + newDirection;
    diagram.innerHTML += "\n" + "classDef default fill:white, stroke:#e0e0e0, stroke-width:1.5px, color:#fff;";
    var curLink = 0;

    for (let entry = 0; entry < THEJSON.length; entry++) {
        let testing = 1;
        if (exceptions.length !== 0) {
            testing = exceptions.findIndex(e => e === THEJSON[entry].product);
        }
        
        if (THEJSON[entry].icon === undefined) THEJSON[entry].icon = defaultIcon;

        if (testing !== -1) {
            let doWeNeedSoloEntry = true;

            if (strictExceptions === false || exceptions.length === 0) {
                for (let entre in THEJSON) {
                    if (THEJSON[entre].integrations !== undefined && THEJSON[entre].integrations.length !== 0) {
                        let priorCon = THEJSON[entre].integrations.find(e => e.product === THEJSON[entry].product)
                        if (priorCon !== undefined) {
                            createArrow(entre, entry, priorCon);
                            if (doWeNeedSoloEntry) doWeNeedSoloEntry = false;
                        }
                    }
                }
            }
            
            if (THEJSON[entry].integrations !== undefined && THEJSON[entry].integrations.length !== 0) {
                if (strictExceptions) {
                    let strictIntegrations = THEJSON[entry].integrations.filter(e => exceptions.includes(e.product));
                    if (strictIntegrations.length === 0) soloEntry();
                    else strictIntegrations.forEach(prepareArrow);
                }
                else THEJSON[entry].integrations.forEach(prepareArrow);
                
                function prepareArrow(con) {
                    let num = THEJSON.findIndex(e => e.product === con.product)
                    if (num === -1) {
                        THEJSON.push({"product": con.product, "icon": defaultIcon});
                        num = THEJSON.length - 1;
                    }
                    else if (THEJSON[num].icon === undefined) THEJSON[num].icon = defaultIcon;

                    createArrow(entry, num, con);
                }
            }
            else if (doWeNeedSoloEntry) soloEntry();
            
            function soloEntry() {
                let title;
                if (THEJSON[entry].title !== undefined && THEJSON[entry].title !== "") title = THEJSON[entry].title;
                else title = THEJSON[entry].product;
                diagram.innerHTML += "\n" + entry + half1 + imgHalf1 + title + imgHalf2 + THEJSON[entry].icon + imgHalf3 + half2;
            }
        }

        if (THEJSON[entry].customStyle !== undefined) {
            diagram.innerHTML += "\n" + "classDef " + String.fromCharCode(65 + entry) + " " + THEJSON[entry].customStyle + ";";
            diagram.innerHTML += "\n" + "class " + entry + " " + String.fromCharCode(65 + entry) + ";";
        }
    }

    function createArrow(firstNum, secNum, conn) {
        let dupeTest; let firstTitle; let secTitle;
        if (THEJSON[firstNum].title !== undefined && THEJSON[firstNum].title !== "") firstTitle = THEJSON[firstNum].title;
        else firstTitle = THEJSON[firstNum].product;

        if (THEJSON[secNum].title !== undefined && THEJSON[secNum].title !== "") secTitle = THEJSON[secNum].title;
        else secTitle = THEJSON[secNum].product;



        if (strokeColors[conn.integration_status] === "red")
            dupeTest = diagram.innerHTML.indexOf(firstNum + half1 + imgHalf1 + firstTitle + imgHalf2 + THEJSON[firstNum].icon + "\">" + half2 + "-.-&gt;" + secNum + half1 + imgHalf1 + secTitle + imgHalf2 + THEJSON[secNum].icon + "\">" + half2);
        else
            dupeTest = diagram.innerHTML.indexOf(firstNum + half1 + imgHalf1 + firstTitle + imgHalf2 + THEJSON[firstNum].icon + "\">" + half2 + "--&gt;" + secNum + half1 + imgHalf1 + secTitle + imgHalf2 + THEJSON[secNum].icon + "\">" + half2);
        
        if (dupeTest !== -1)
            return;
        

        if (strokeColors[conn.integration_status] === "red")
            diagram.innerHTML += "\n" + firstNum + half1 + imgHalf1 + firstTitle + imgHalf2 + THEJSON[firstNum].icon + imgHalf3 + half2 + "-.->" + secNum + half1 + imgHalf1 + secTitle + imgHalf2 + THEJSON[secNum].icon + imgHalf3 + half2;
        else
            diagram.innerHTML += "\n" + firstNum + half1 + imgHalf1 + firstTitle + imgHalf2 + THEJSON[firstNum].icon + imgHalf3 + half2 + "-->" + secNum + half1 + imgHalf1 + secTitle + imgHalf2 + THEJSON[secNum].icon + imgHalf3 + half2;
                    
        diagram.innerHTML += "\n" + "linkStyle " + curLink + " stroke:" + strokeColors[conn.integration_status];
        curLink++;
    }

    diagram.innerHTML += "\n" + "classDef sechlight stroke:#c5c5c5, stroke-width:2px;";
    console.log(diagram.innerHTML);

    divi.appendChild(diagram);
    activateDiagram();
}

function clicked(source, event) {
    if (document.getElementById("infoBox") !== null) {
        document.getElementById("infoBox").remove();
        boxPopup = false;
    }
    
    let t, bordCol, delvCol, d, islink;
    let aa = [];
    if (source.constructor !== Array) {
        if (THEJSON[source].title !== undefined && THEJSON[source].title !== "") t = THEJSON[source].title; else t = THEJSON[source].product;
        if (THEJSON[source].description !== undefined && THEJSON[source].description !== "") d = THEJSON[source].description;
    }
    else {
        let t1, t2;
        let s1 = source[0].split("-"); let s2 = source[1].split("-");
        if (THEJSON[s1[1]].title !== undefined && THEJSON[s1[1]].title !== "") t1 = THEJSON[s1[1]].title; else t1 = THEJSON[s1[1]].product;
        if (THEJSON[s2[1]].title !== undefined && THEJSON[s2[1]].title !== "") t2 = THEJSON[s2[1]].title; else t2 = THEJSON[s2[1]].product;
        t = "Integration: " + t1 + " to " + t2;

        let dd = THEJSON[s1[1]].integrations.findIndex(e => e.product === THEJSON[s2[1]].product);
        let d3 = THEJSON[s1[1]].integrations[dd];
        
        if (d3.integration_status !== undefined && d3.integration_status !== "") bordCol = d3.integration_status;
        if (d3.expected_delivery !== undefined && d3.expected_delivery !== "") delvCol = d3.expected_delivery;

        if (d3.integration_description !== undefined && d3.integration_description !== "") d = d3.integration_description;

        if (d3.links !== undefined) {
            d3.links.forEach(l => {
                if (l.name !== undefined && l.name !== "" && l.link !== undefined && l.link !== "")
                    aa.push(l)
            });
        }
        
        islink = true;
    }
    createBox(t, bordCol, delvCol, d, aa, event, islink);
}

function createBox(titlep, bordCol, delvCol, descp, alinks, event, islink) {
    document.querySelector(":root").style.setProperty("--extraPadding", 0 + "px");
    
    let box = document.createElement("div");
    box.id = "infoBox";
    box.addEventListener("mouseenter", function() {dontDelete = true;});
    box.addEventListener("mouseleave", function() {dontDelete = false;});
    
    document.body.appendChild(box);

    createText(titlep, true, islink); 
    if (islink) createStatus(bordCol, "Status");
    if (delvCol !== undefined) createStatus(delvCol);
    if (descp !== undefined) createText(descp, false);

    function createText(text, bold, exception) {
        let p = document.createElement("p");
        p.className = "boxContent";
        p.innerHTML = text;
        if (bold) p.classList.add("boldme");
        if (exception) p.classList.add("marginMe");
        box.appendChild(p);
    }

    function createStatus(text, type) {
        let p = document.createElement("p");
        p.className = "boxContent";
        p.classList.add("boldme");
        p.classList.add("ImaStatus");
        if (type === "Status") {
            p.innerHTML = "Status: ";
            switch (text) {
                case "active":
                    p.innerHTML += "Active";
                    break;
                case "ongoing":
                    p.innerHTML += "Ongoing Development";
                    break;
                case "not_started":
                    p.innerHTML += "Planned";
                    break;
                default:
                    p.innerHTML += "Unknown";
            }
            if (delvCol !== undefined) p.classList.add("marginMe");
        }
        else {
            p.innerHTML = "Expected Delivery: " + text;
        }
        box.appendChild(p);
    }

    let linksMade = 0;
    let dov = document.createElement("div");
    dov.className = "boxContent";
    box.appendChild(dov);
    if (alinks.length > 0) {
        for (l in alinks) {
            createLink(alinks[l].link, alinks[l].name);
        }
    }
    
    function createLink(link, innerstuff) {
        let a = document.createElement("a");
        a.classList.add("boxLink");
        a.classList.add("boxLinkH");
        a.target = "_blank";
        if (linksMade >= 1) {
            let a = document.createElement("a");
            a.className = "boxContent";
            a.classList.add("boxLink");
            a.innerHTML = "|";
            dov.appendChild(a);
        }
        else {
            document.querySelector(":root").style.setProperty("--extraPadding", 5 + "px");
        }
        a.innerHTML = innerstuff
        a.setAttribute("href", link);
        dov.appendChild(a);
        linksMade++;
    }

    if (event.pageX + box.offsetWidth >= document.body.offsetWidth) {
        let hehe = document.body.offsetWidth - (event.pageX + box.offsetWidth);
        box.style.left = (event.pageX + hehe) + "px";
    }
    else
        box.style.left = event.pageX + "px";
    box.style.top = event.pageY + "px";

    box.classList.add("stationaryBox");
    
    document.querySelector(":root").style.setProperty("--checkOffset", (document.getElementById("AllMyChecks").offsetHeight + 100) + "px");
    document.querySelector(":root").style.setProperty("--checkPhoneOffset", (document.getElementById("AllMyChecks").offsetHeight + 95 - box.offsetHeight) + "px");

    if (!imStationary) box.classList.remove("stationaryBox");
}