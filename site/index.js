// Libs 
import data from '../modules/dataModule.js';
import { TableObject } from '../modules/tableObjects.js';
function print(text) {
    return console.log(text);
}
let mouseX = 0;
let mouseY = 0;
// Verificar cookie do usuário ao carregar a página
/*  -- Desativado temporariamente

document.addEventListener('DOMContentLoaded', function () {
    const user = getCookie('user');
    const displayText = document.getElementById('displayText');

    if (user) {
        displayText.textContent = `Bem vindo(a) ${user}!`;

        const cooldown = 240; // segundos
        const lastWebhookTime = getCookie('last_webhook_time');

        if (!lastWebhookTime || (Date.now() / 1000) - lastWebhookTime > cooldown) {
            document.cookie = `last_webhook_time=${Math.floor(Date.now() / 1000)}; max-age=${86400 * 30}`;
            data.sendWebhook("SITE", `O player: \`${user}\`\n**Entrou no site**.`);
        }
    } else {
        window.location.href = 'index.html';
    }
});

*/
// Temporario - Verify
document.addEventListener('DOMContentLoaded', function () {
    const user = data.getCookie('user');
    const displayText = document.getElementById('displayText');
    displayText.textContent = `Saudações ${user}.`;
    if (user === "g4uradmins") {
        const cooldown = 240; // segundos
        const lastWebhookTime = data.getCookie('last_webhook_time');
        if (!lastWebhookTime || (Date.now() / 1000) - lastWebhookTime > cooldown) {
            document.cookie = `last_webhook_time=${Math.floor(Date.now() / 1000)}; max-age=${86400 * 30}`;
            data.sendWebhook("SITE", `O player: \`${user}\`\n**Entrou no site**.`, 'warning');
        }
    }
    else {
        data.removeCookie('user');
        data.removeCookie('last_webhook_time');
        window.location.href = '../noauth/';
    }
});
let tooltipElements = [];
for (let i = 0; i < document.getElementsByTagName("*").length; i++) {
    const element = document.getElementsByTagName("*").item(i);
    if (element.hasAttribute("tooltip"))
        tooltipElements.push(element);
}
tooltipElements.forEach(element => {
    element.onmouseenter = function () {
        tooltipShow(element.getAttribute("tooltip"));
    };
    element.onmouseleave = tooltipClose;
});
const tooltip = document.getElementById("tooltip");
function tooltipShow(name) {
    tooltip.style.visibility = "visible";
    tooltip.style.left = mouseX + 10 + "px";
    tooltip.style.top = mouseY + 10 + "px";
    tooltip.innerHTML = name;
}
function tooltipClose() {
    document.getElementById("tooltip").style.visibility = "collapse";
}
document.addEventListener('mousemove', function (e) {
    mouseX = e.x;
    mouseY = e.y;
    if (tooltip.style.visibility != "visible")
        return;
    tooltip.style.left = mouseX + 10 + 'px';
    tooltip.style.top = mouseY + 10 + 'px';
});
let canDoAnything = true;
function norgetSpawn() {
    document.getElementById('displayText').innerHTML = "Para você!";
    let norget = new TableObject("norget", "objects/Norget.webp", [400, 290], 170);
    norget.setRightClick(function (e) {
        e.preventDefault();
        tooltipShow("Norget");
    });
    norget.setMouseLeave(tooltipClose);
}
let candleOn = false;
function lighterSpawn() {
    document.getElementById('displayText').innerHTML = "Isso serve?";
    let lighter = new TableObject("norget", "objects/Lighter.png", [400, 290], 335 / 2);
    lighter.setGrabSprite("objects/Lighter.gif");
    lighter.ondrag = function () {
        if (candleOn)
            return;
        let numberLeft = Number(lighter.element.style.left.replace("px", ""));
        let numberTop = Number(lighter.element.style.top.replace("px", ""));
        if (numberLeft > 750 && numberLeft < 800 && numberTop > 330 && numberTop < 440)
            lightCandle();
    };
}
function lightCandle() {
    candleOn = true;
    const candleLight = document.getElementById("candle-light");
    candleLight.style.visibility = "visible";
    const candle = document.getElementById("candle");
    candle.src = "./IMG/candle-on.gif";
    const table = document.getElementById("table");
    table.src = "./IMG/table-2.png";
    const mysteryWall = document.getElementById("mystery-wall");
    mysteryWall.style.visibility = "visible";
}
function whenDie() {
    document.getElementById('displayText').innerHTML = data.getCookie('deathseed');
}
function openGBScreen() {
    setTimeout(() => {
        document.getElementById('displayText').innerHTML = "";
    }, 2500);
    const html = document.body;
    html.animate([
        // keyframes
        { transform: "scale(1, 1) translateX(0px) translateY(0px)", opacity: 1 },
        { transform: "scale(4.5, 4.5) translateX(220px) translateY(100px)", opacity: 0 },
    ], {
        // timing options
        duration: 3500,
        easing: "cubic-bezier(1,.02,.84,.95)"
    }).onfinish = function () {
        setTimeout(function () {
            window.open("../AX2OM", "_self");
        }, 500);
    };
    html.style.opacity = "0";
    blurAll();
    canDoAnything = false;
}
function process(display) {
    if (!canDoAnything)
        return;
    const user = data.getCookie('user');
    $.getJSON("../resources/inputs.json", function (json) {
        let input_value = (String)(display.toUpperCase());
        input_value = input_value.trim().replace("?", "");
        let hasInput = false;
        $.each(json, function (i, value) {
            const isWeakTyped = value.weak;
            if (!isWeakTyped) {
                if (!value.input.includes(input_value))
                    return;
            }
            else {
                for (let i = 0; i < value.input.length; i++) {
                    if (!input_value.includes(value.input[i]))
                        return;
                }
            }
            hasInput = true;
            const isRandom = value.random;
            let content = value.result;
            if (typeof content === "object" && isRandom) {
                content = content[Math.round(Math.random())];
            }
            else {
                content = content.trim().replace("%user%", data.getCookie('user'));
            }
            if (input_value === "AX2OM_NRGT") {
                openGBScreen();
                return;
            }
            if (content.startsWith("function=")) {
                eval(content.split("=")[1] + "();");
                return false;
            }
            if (content.startsWith("https://")) {
                data.sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``, 'success');
                window.open(content, '_blank');
                return false;
            }
            if (content.endsWith(".mp3")) {
                document.getElementById('displayText').innerHTML = "<audio style=\"width:160px;\" controls><source src=\"../resources/" + content + "\" type=\"audio/mpeg\"></audio>";
                return false;
            }
            const extensions = ["pdf", "jpeg", "jpg", "png", "webm", "webp"];
            let hasAnyExtension = false;
            for (let i = 0; i < extensions.length; i++) {
                const element = extensions[i];
                if (content.endsWith("." + element)) {
                    hasAnyExtension = true;
                    break;
                }
            }
            if (hasAnyExtension) {
                data.sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``, 'success');
                openMedia("../resources/" + content);
                return false;
            }
            if (content === "EXIT()") { // Faz o logout //
                let username = data.getCookie('user');
                data.removeCookie('user');
                data.removeCookie('last_webhook_time');
                data.removeCookie('seed');
                data.removeCookie('deathseed');
                if (!data.getCookie('user') || !data.getCookie('last_webhook_time')) {
                    data.sendWebhook("SITE - SAIU", `O player: \`${username}\`\n\n**Saiu do site usando EXIT() !**`, 'warning');
                    window.location.href = '../index.html';
                }
                return false;
            }
            document.getElementById('displayText').innerHTML = content;
            data.sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``, 'success');
            return false;
        });
        if (!hasInput)
            document.getElementById('displayText').innerHTML = "Entrada não encontrada<br>Tente novamente.";
    });
}
// Manipular o envio do formulário
document.getElementById('consoleForm').addEventListener('submit', function (event) {
    event.preventDefault();
    if (!canDoAnything)
        return;
    const inputElement = document.getElementById('pcinput');
    process(inputElement.value);
    inputElement.value = '';
});
function openMedia(path) {
    if (!canDoAnything)
        return;
    if (path.endsWith(".pdf")) {
        window.open(path, '_blank');
        return;
    }
    blurAll();
    let isImg = !path.endsWith(".webm");
    const mediaOverlayContainer = document.getElementById("mediaOverlayContainer");
    const mediaOverlay = document.getElementById("mediaOverlay" + (isImg ? "I" : "V"));
    document.getElementById("mediaOverlay" + (isImg ? "V" : "I")).style.visibility = "collapse";
    mediaOverlayContainer.style.visibility = "visible";
    mediaOverlay.style.visibility = "visible";
    mediaOverlay.src = path;
    const animation = mediaOverlayContainer.animate([
        { opacity: 0 },
        { opacity: 1 }
    ], {
        easing: 'ease',
        duration: 500
    });
    mediaOverlay.onclick = function () {
        closeMedia(mediaOverlay, !isImg);
    };
    animation.play();
    if (!isImg) {
        setTimeout(function () {
            mediaOverlay.play();
        }, 1000);
    }
}
function closeMedia(overlayElement, video) {
    if (!canDoAnything)
        return;
    canDoAnything = false;
    if (video)
        overlayElement.pause();
    const mediaOverlayContainer = document.getElementById("mediaOverlayContainer");
    const animation = mediaOverlayContainer.animate([
        { opacity: 1 },
        { opacity: 0 }
    ], {
        easing: 'ease',
        duration: 500
    });
    animation.onfinish = function () {
        mediaOverlayContainer.style.visibility = "hidden";
        overlayElement.src = '';
        overlayElement.style.visibility = "collapse";
        canDoAnything = true;
    };
}
function blurAll() {
    const tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}