import data from '../modules/dataModule.js';
import tableObjects, { TableObject } from '../modules/tableObjects.js';
import sound from '../modules/sound.js';

let mouseX:number = 0;
let mouseY:number = 0;

let candleOn:boolean = false;


let initialized:boolean = false;

document.addEventListener('DOMContentLoaded', function () {
    const authenticate:boolean = data.verify();
    if (authenticate) {
        const user = data.getCookie('user');
        const displayText:HTMLElement = document.getElementById('displayText');
        displayText.innerHTML = `Saudações ${user}.<br>Digite 'ajuda' para info.`;

        if (data.getCookie("candlelight") == "true") {
            lightCandle(true);
        }

        const main = document.getElementById("main");

        function initialize() {
            if (initialized) {
                return;
            }
            initialized = true;
            main.style.cursor = "auto";
            main.animate([{ filter: "brightness(0.5) blur(2px)" },{ filter: "brightness(1) blur(0px)" }],{easing: 'ease',duration: 500,fill: "forwards"});

            const l = sound.playSound("./snd/light.mp3", .3, true);
            if (candleOn) {
                const f = sound.playSound("./snd/fire.mp3", 0.33, true);
            }
        }

        main.onclick = initialize;
        main.onbeforeinput = initialize;
        main.ondragstart = initialize;
        main.onselect = initialize;
    }

});

let raining:boolean = false;

setInterval(() => {
    if (!initialized || raining) {return;}
    if (Math.random() > 0.6) {
        raining = true;
        const a = sound.playSound("./snd/water.mp3", 0.1, true);
        sound.getSoundAndFadeAudio(a, 2);

        setTimeout(() => {
            a.pause();
            a.currentTime = 0;
            raining = false;
        }, 10000 + Math.random() * 30000);
    }
}, 30000 + Math.random() * 30000)

let canZoom:boolean = true;
let zoomedIn:boolean = false

document.getElementById("pcscreen").onclick = () => {
    if (!canZoom) return;
    canZoom = false;
    canDoAnything = false;

    const main:HTMLElement = document.getElementById("main");
    

    if (zoomedIn) {
        main.animate([{ transform: "scale(4, 4) translateX(220px) translateY(120px)"},{ transform: "scale(1, 1) translateX(0px) translateY(0px)"},],
        { duration: 1500,easing: "cubic-bezier(.78,.25,.73,1.03)",fill: 'forwards' }).onfinish = () => {
            canZoom = true;canDoAnything = true;
        }
    } else {
        main.animate([{ transform: "scale(1, 1) translateX(0px) translateY(0px)"},{ transform: "scale(4, 4) translateX(220px) translateY(120px)"},],
        { duration: 1500,easing: "cubic-bezier(.78,.25,.73,1.03)",fill: 'forwards' }).onfinish = () => {
            canZoom = true;
        }
    }
    zoomedIn = !zoomedIn;

}

let tooltipElements = [];

for (let i = 0; i < document.getElementsByTagName("*").length; i++) {
    const element:Element = document.getElementsByTagName("*").item(i);
    if (element.hasAttribute("tooltip"))
        tooltipElements.push(element);
}
tooltipElements.forEach(element => {
    element.onmouseenter = function() {
        tooltipShow(element.getAttribute("tooltip"));
    }
    element.onmouseleave = tooltipClose;
});

const tooltip:HTMLElement = document.getElementById("tooltip");
function tooltipShow(name:string):void {
    tooltip.style.visibility = "visible";
    tooltip.style.left = mouseX + 10 + "px";
    tooltip.style.top = mouseY + 10 + "px";
    tooltip.innerHTML = name;
}
function tooltipClose():void {
    document.getElementById("tooltip").style.visibility = "collapse";
}

document.addEventListener('mousemove', function(e) {
    mouseX = e.x;
    mouseY = e.y;

    if (tooltip.style.visibility != "visible") return;

    tooltip.style.left = mouseX + 10 + 'px';
    tooltip.style.top = mouseY + 10 + 'px';
});

let canDoAnything:boolean = true;

function norgetSpawn():void {
    document.getElementById('displayText').innerHTML = "Para você!";
    let norget:TableObject = new TableObject("norget", "objects/Norget.webp", [0, -200], 170);
    norget.setRightClick(function(e) {
        e.preventDefault();
        tooltipShow("Norget");
    });
    norget.setMouseLeave(tooltipClose);
}

function lighterSpawn():void {
    document.getElementById('displayText').innerHTML = "Isso serve?";
    let lighter:TableObject = new TableObject("norget", "objects/Lighter.png", [-500, -200], 335/2);
    lighter.setGrabSprite("objects/Lighter.gif");
    lighter.ondrag = function() {
        if (candleOn) return;
        let numberLeft:number = Number(lighter.element.style.left.replace("px", ""));
        let numberTop:number = Number(lighter.element.style.top.replace("px", ""));

        if (numberLeft > 50 && numberTop > -175 && numberTop < -55 && numberLeft < 130)
            lightCandle();
    }
}
function lightCandle(withCookie:boolean = false):void {
    candleOn = true;
    document.cookie = "candlelight=true; path=/";
    if (!withCookie) {
        const audio = sound.playSound("./snd/fire.mp3", 0.2, true);
    }

    const candleLight:HTMLImageElement = document.getElementById("candle-light") as HTMLImageElement;
    candleLight.style.visibility = "visible"
    const candle:HTMLImageElement = document.getElementById("candle") as HTMLImageElement;
    candle.src = "./IMG/candle-on.gif";
    candle.removeAttribute("tooltip");
    candle.onmouseenter = () => null;
    candle.style.cursor = "auto"
    
    const table:HTMLImageElement = document.getElementById("table") as HTMLImageElement;
    table.src = "./IMG/table-2.png";
    const mysteryWall:HTMLImageElement = document.getElementById("mystery-wall") as HTMLImageElement;
    mysteryWall.style.visibility = "visible";
}

function protoLoad():void {
    document.getElementById('displayText').innerHTML = "<img src=\"./load.gif\" style=\"width: 32px; transform: translate(-50%, -50%)\">"
}

function whenDie():void {
    document.getElementById('displayText').innerHTML = data.getCookie('deathseed');
}
function openGBScreen():void {
    setTimeout(() => {
        document.getElementById('displayText').innerHTML = "";
    }, 2500);
    const main:HTMLElement = document.getElementById("main");
    main.animate(
        [
            // keyframes
            { transform: "scale(1, 1) translateX(0px) translateY(0px)", opacity: 1 },
            { transform: "scale(4.5, 4.5) translateX(220px) translateY(100px)", opacity: 0 },
        ],
        {
            // timing options
            duration: 3500,
            easing: "cubic-bezier(1,.02,.84,.95)"
        },
    ).onfinish = function () {
        setTimeout(function() {
            window.open("../AX2OM", "_self");
        }, 500)
    };
    main.style.opacity = "0";
    blurAll();
    canDoAnything = false;
}


function process(display:string):void {
    if (!canDoAnything) return;

    const user:string = data.getCookie('user');

    $.getJSON(data.sc("Li4vcmVzb3VyY2VzL2lucHV0cy5qc29u"), function(json) {
        let input_value:string = (String)(display.toUpperCase());
        input_value = input_value.trim().replace("?", "")

        let hasInput:boolean = false;
        $.each(json, function (i, value) {
            const isWeakTyped:boolean|null = value.weak;
            
            if (!isWeakTyped) {
                if (!value.input.includes(input_value))
                    return;
            } else {
                for (let i = 0; i < value.input.length; i++) {
                    if (!input_value.includes(value.input[i]))
                        return;
                }
            }
            
            hasInput = true;
            const isRandom:boolean|null = value.random;

            let content:string|string[] = value.result;

            if (typeof content === "object" && isRandom) {
                content = (content as string[])[Math.round(Math.random())];
            } else {
                content = (content as string).trim().replace("%user%", data.getCookie('user'));
            }

            if (input_value === data.sc("QVgyT01fTlJHVA==")) {
                openGBScreen();
                return;
            }

            if (content.startsWith("function=")) {
                eval(content.split("=")[1] + "();");
                return false;
            }

            if (content.startsWith("https://")){
                data.sendWebhook(
                    "SITE - LOG-BUSCA", 
                    `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                    'success',
                );
                
                window.open(content, '_blank');
                return false;
            }

            if (content.endsWith(".mp3")) {
                document.getElementById('displayText').innerHTML = "<audio style=\"width:160px;\" controls><source src=\"../resources/" + content + "\" type=\"audio/mpeg\"></audio>"
                return false;
            }

            const extensions:string[] = ["pdf", "jpeg", "jpg", "png", "webm", "mp4", "webp"];
            let hasAnyExtension:boolean = false;
            for (let i = 0; i < extensions.length; i++) {
                const element = extensions[i];
                if (content.endsWith("." + element)) {
                    hasAnyExtension = true;
                    break;
                }
            }
            if (hasAnyExtension) {
                data.sendWebhook(
                    "SITE - LOG-BUSCA",
                    `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                    'success',
                );
                openMedia("../resources/" + content);
                return false;
            }

            if (content === "EXIT()") { // Faz o logout //
                let username = data.getCookie('user');

                data.removeCookie('user');
                data.removeCookie('last_webhook_time'); 
                data.removeCookie('seed');
                data.removeCookie('deathseed');
                data.removeCookie('candlelight');

                if (!data.getCookie('user') || !data.getCookie('last_webhook_time')) {
                    data.sendWebhook(
                        "SITE - SAIU",
                        `O player: \`${username}\`\n\n**Saiu do site usando EXIT() !**`,
                        'warning'
                    )

                    window.location.href = '../index.html';
                }
                return false;
            }

            document.getElementById('displayText').innerHTML = content;
            const blip = sound.playSound("./snd/blip.mp3", 0.25, false);

            data.sendWebhook(
                "SITE - LOG-BUSCA", 
                `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                'success',
            );
            return false;
        });
        if (!hasInput) {
            sound.playSound("./beepmsg.mp3", 0.5);
            if (input_value.length !== 0) {
                try {
                    data.sendWebhook(
                        "SITE - LOG-BUSCA", 
                        `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: falhou`,
                        'error',
                    );
                } catch (error) {}
            }
            
            const displayText = document.getElementById('displayText');
            displayText.innerHTML = "Entrada não encontrada<br>Tente novamente.";
            displayText.animate([
                { color: "red" },
                { color: "red" },
                { color: "white" }
              ], {
                easing: 'ease',
                duration: 500
              }
          );
        }
    });
}

// Manipular o envio do formulário
document.getElementById('consoleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    if (!canDoAnything) return;

    const inputElement:HTMLInputElement = document.getElementById('pcinput') as HTMLInputElement;
    process(inputElement.value);
    inputElement.value = '';
});

(document.getElementById('pcinput') as HTMLInputElement).addEventListener("keypress", function(event) {
    sound.playSound("./snd/typing.mp3", .3, false)
})
        
function openMedia(path:string) {
    if (!canDoAnything) return;
    
    if (path.endsWith(".pdf")) {
        window.open(path, '_blank');
        return;
    }

    blurAll();

    let isImg:boolean = !path.endsWith(".webm") && !path.endsWith(".mp4");
    
    const mediaOverlayContainer:HTMLDivElement = document.getElementById("mediaOverlayContainer") as HTMLDivElement;
    const mediaOverlay:HTMLImageElement|HTMLVideoElement = document.getElementById("mediaOverlay" + (isImg ? "I" : "V")) as HTMLImageElement|HTMLVideoElement;
    document.getElementById("mediaOverlay" + (isImg ? "V" : "I")).style.visibility = "collapse";

    mediaOverlayContainer.style.visibility = "visible";
    mediaOverlay.style.visibility = "visible";
    mediaOverlay.src = path;

    const animation:Animation = mediaOverlayContainer.animate(
        [
          { opacity: 0 },
          { opacity: 1 }
        ], {
          easing: 'ease',
          duration: 500
        }
    );

    mediaOverlay.onclick = function() {
        closeMedia(mediaOverlay, !isImg);
    };

    animation.play();

    if (!isImg) {
        setTimeout(function() {
            (mediaOverlay as HTMLVideoElement).play();
        }, 1000)
    }
}
function closeMedia(overlayElement:HTMLImageElement|HTMLVideoElement, video:boolean) {
    if (!canDoAnything) return;
    canDoAnything = false;

    if (video)
        (overlayElement as HTMLVideoElement).pause();

    const mediaOverlayContainer:HTMLDivElement = document.getElementById("mediaOverlayContainer") as HTMLDivElement;
    
    const animation:Animation = mediaOverlayContainer.animate(
        [
          { opacity: 1 },
          { opacity: 0 }
        ], {
          easing: 'ease',
          duration: 500
        }
    );
    animation.onfinish = function() {
        mediaOverlayContainer.style.visibility = "hidden";
        overlayElement.src = '';
        overlayElement.style.visibility = "collapse";
        canDoAnything = true;
    }

}

function blurAll(){
    const tmp:HTMLInputElement = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}