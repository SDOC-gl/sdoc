// Libs 

import data from './dataModule.js';



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

    if (user === "g4uradmins") {
        displayText.textContent = `Welcome ${user}!`;

        const cooldown = 240; // segundos
        const lastWebhookTime = data.getCookie('last_webhook_time');

        if (!lastWebhookTime || (Date.now() / 1000) - lastWebhookTime > cooldown) {
            
            document.cookie = `last_webhook_time=${Math.floor(Date.now() / 1000)}; max-age=${86400 * 30}`;
            
            data.sendWebhook(
                "SITE", 
                `O player: \`${user}\`\n**Entrou no site**.`,
                'warning'
            );
        }
    } else {
        data.removeCookie('user');

        data.removeCookie('last_webhook_time');
        
        window.location.href = '../noauth/';
    }
});

let tooltipElements = [];

for (let i = 0; i < document.getElementsByTagName("*").length; i++) {
    const element = document.getElementsByTagName("*").item(i);
    if (element.hasAttribute("tooltip")) {
        tooltipElements.push(element);
    }
}
tooltipElements.forEach(element => {
    element.onmouseenter = function() {
        tooltipShow(element.getAttribute("tooltip"));
    }
    element.onmouseleave = tooltipClose;
});

const tooltip = document.getElementById("tooltip");
function tooltipShow(name = String) {
    tooltip.style.visibility = "visible";
    tooltip.innerHTML = name;
}
function tooltipClose() {
    document.getElementById("tooltip").style.visibility = "collapse";
}

document.addEventListener('mousemove', function(e) {
        if (tooltip.style.visibility != "visible") return;
        let left = e.x;
        let top = e.y;
        tooltip.style.left = left + 10 + 'px';
        tooltip.style.top = top + 10 + 'px';
    }
);

let canDoAnything = true;

function norgetSpawn() {
    document.getElementById('displayText').innerHTML = "Para você!";
}
function whenDie() {
    document.getElementById('displayText').innerHTML = data.getCookie('deathseed');
}


function process(display) {
    if (!canDoAnything) return;


    const user = data.getCookie('user');

    $.getJSON("../resources/inputs.json", function(json) {
        let input_value = (String)(display.toUpperCase());
        input_value = input_value.trim().replace("?", "")

        let hasInput = false;
        $.each(json, function (i, value) { 
            const isWeakTyped = (Boolean)(value.weak);
            if (isWeakTyped) {
                for (let i = 0; i < value.input.length; i++) {
                    if (!input_value.includes(value.input[i]))
                        return;
                }   
            } else {
                if (!value.input.includes(input_value))
                    return;
            }
            
            hasInput = true;
            const isRandom = (Boolean)(value.random);

            let content = value.result;
            content = content.trim().replace("%user%", data.getCookie('user'));

            if (typeof content == "object" && isRandom) {
                content = content[Math.round(Math.random())];
            }

            if (content.startsWith("function=")) {
                eval(content.split("=")[1] + "();")
                return;
            }

            if (/^https?:\/\//.test(content)) { // Verifica se é um link //

                data.sendWebhook(
                    "SITE - LOG-BUSCA", 
                    `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                    'success',
                );
                
                window.open(content, '_blank');
                
                return;
            }

            if (content.endsWith(".mp3")) {
                document.getElementById('displayText').innerHTML = "<audio style=\"width:160px;\" controls><source src=\"../resources/" + content + "\" type=\"audio/mpeg\"></audio>"
                return;
            }

            if (/\.(pdf|jpeg|jpg|png|webm|webp)$/i.test(content)) { // Verifica se é uma foto/video //

                data.sendWebhook(
                    "SITE - LOG-BUSCA",
                    `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                    'success',
                );
                openMedia("../resources/" + content);                        
                return;
            }

            if (content === "EXIT()") { // Faz o logout //

                let username = data.getCookie('user');

                data.removeCookie('user');
                data.removeCookie('last_webhook_time');
                data.removeCookie('seed');
                data.removeCookie('deathseed');

                if (!data.getCookie('user') || !data.getCookie('last_webhook_time')) {

                    data.sendWebhook(
                        "SITE - SAIU",
                        `O player: \`${username}\`\n\n**Saiu do site usando EXIT() !**`,
                        'warning'
                    )

                    window.location.href = '../index.html';
                } else {
                    console.log("Houve um erro");
                }
                return;
            }

            document.getElementById('displayText').innerHTML = content;

            data.sendWebhook(
                "SITE - LOG-BUSCA", 
                `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                'success',
            );
            return;
        });
        if (!hasInput)
            document.getElementById('displayText').innerHTML = "Entrada não encontrada<br>Tente novamente.";
    });
}

// Manipular o envio do formulário
document.getElementById('consoleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    if (!canDoAnything) return;

    const inputElement = document.getElementById('pcinput');
    process(inputElement.value);
    inputElement.value = '';
});
    
function openMedia(path = String) {
    if (!canDoAnything) return;
    
    if (path.endsWith(".pdf")) {
        window.open(path, '_blank');
        return;
    }

    blurAll();

    let isImg = !path.endsWith(".webm");
    let suffix = "V"
    if (isImg)
        suffix = "I";
    
    const mediaOverlayContainer = document.getElementById("mediaOverlayContainer");
    const mediaOverlay = document.getElementById("mediaOverlay" + suffix);
    if (suffix === "V")
        document.getElementById("mediaOverlayI").style.visibility = "collapse";
    else
        document.getElementById("mediaOverlayV").style.visibility = "collapse";
    mediaOverlayContainer.style.visibility = "visible";
    mediaOverlay.style.visibility = "visible";
    mediaOverlay.src = path;

    const animation = mediaOverlayContainer.animate(
        [
          { opacity: 0 },
          { opacity: 1 }
        ], {
          easing: 'ease',
          duration: 500
        }
    );

    mediaOverlay.onclick = function() {
        closeMedia(mediaOverlay, suffix == "V");
    };

    animation.play();


    if (!isImg) {
        setTimeout(function() {
            mediaOverlay.play();
        }, 1000)
    }
}
function closeMedia(overlayElement, video = Boolean) {
    if (!canDoAnything) return;
    canDoAnything = false;

    if (video)
        overlayElement.pause();

    const mediaOverlayContainer = document.getElementById("mediaOverlayContainer");
    
    
    const animation = mediaOverlayContainer.animate(
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
        overlayElement.src = null;
        overlayElement.style.visibility = "collapse";
        canDoAnything = true;
    }

}

function blurAll(){
    var tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}
   