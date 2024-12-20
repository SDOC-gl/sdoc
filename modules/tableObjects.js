export class TableObject {
    constructor(identifier = String, graphic = String, pos = Float32Array, size = Number, draggable = true, customFallHeight = 40) {
        if (document.getElementById("to-" + identifier) != null) {
            return;
        }

        const node = document.getElementById("to-template").cloneNode(false);
        node.setAttribute("tableobject", "");
        node.style.visibility = "visible";
        node.id = "to-" + identifier;
        node.src = "../resources/" + graphic;
        node.width = size;
        node.style.left = pos[0] + "px";
        node.style.top = pos[1] + "px";

        document.getElementById("to-template").parentElement.appendChild(node);

        this.element = node;
        this.elementname = node.id;
        this.ondrag = function() {};

        makeDraggable(this, !draggable, customFallHeight);
    }
    setRightClick(method) {
        this.element.addEventListener('contextmenu', method, false);
    }
    setMouseLeave(method) {
        this.element.addEventListener('mouseleave', method, false);
    }
    setGrabSprite(sprite) {
        this.element.setAttribute("grabsprite", "../resources/" + sprite);
    }
    destroy() {
        this.element = null;
        document.getElementById(this.elementname).remove();
    }
}

function getTableObjects() {
    let tableObjectElements = [];
    for (let i = 0; i < document.getElementsByTagName("*").length; i++) {
        const element = document.getElementsByTagName("*").item(i);
        if (element.hasAttribute("tableobject")) {
            tableObjectElements.push(element);
            element.style.position = "absolute";
        }
    }
    return tableObjectElements;
}

const BASE_FALL_HEIGHT = 40;
let fallHeight = BASE_FALL_HEIGHT;
function makeDraggable(obj = TableObject, gravityOnly = false, customFallHeight = 40) {
    const elmnt = obj.element;
    
    const ogSrc = elmnt.src;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (!gravityOnly)
        elmnt.onmousedown = dragMouseDown;

    updateElementPhysics()
  
    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
        e.preventDefault();
        elmnt.style.cursor = "grabbing";

        obj.ondrag();
        if (elmnt.hasAttribute("grabsprite") && elmnt.src == ogSrc)
            elmnt.src = elmnt.getAttribute("grabsprite");

        fallHeight = customFallHeight + (Number(elmnt.style.left.replace("px", "")) / 8);
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        if ((elmnt.offsetTop - pos2) <= fallHeight)
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        else {
            elmnt.style.top = fallHeight + "px";
        }
        if ((elmnt.offsetLeft - pos1) > -550 && (elmnt.offsetLeft - pos1) < 300) {
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    }
  
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.style.cursor = "grab";
        if (elmnt.hasAttribute("grabsprite")) {
            elmnt.src = ogSrc;
        }

        updateElementPhysics();
    }
    function updateElementPhysics() {
        let accel = 1;
        fallHeight = customFallHeight + (Number(elmnt.style.left.replace("px", "")) / 8);
        const myinterval = setInterval(function() {
            let elmntTop = Number(elmnt.style.top.replace("px", ""));
            if (elmntTop < fallHeight) {
                if (elmntTop + 10 * accel > fallHeight) {
                    elmnt.style.top = fallHeight + 10 + "px";
                    return;
                }
                elmnt.style.top = elmntTop + 10 * accel + "px";
                accel *= 1.5; 
            } else {
                clearInterval(myinterval);
                accel = 1;
                elmnt.style.top = fallHeight + "px";
            }
        }, 30);
    }   
}

export default {
    TableObject,
    getTableObjects
}