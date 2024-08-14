// Função para enviar o webhook.
function sendWebhook(titulo, descricao) {
    const webhookUrl = "https://discord.com/api/webhooks/1273020022800781494/Y8Ib_CCKtaui7yNP6DZysUSlbx1xxZySc6g5FlhwiOUIOTJmzTjbiV8VICC75911gaS_";

    const data = {
        embeds: [{
            title: titulo,
            description: descricao,
            timestamp: new Date().toISOString(),
        }],
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'JavaScript Discord Webhook'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.text())
        .then(text => console.log(text))
        .catch(error => console.error('Erro:', error));
}

// Processar entrada e buscar no JSON
function process(display) {
    const user = getCookie('user');
    const jsonUrl = 'https://raw.githubusercontent.com/Atliylol/atliylol.github.io/main/resources/inputs.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(processings => {
            let input_value = (String)(display.toUpperCase());

            for (const processing of processings) {
                if (processing.input.map(item => item.toUpperCase()).includes(input_value)) {
                    const isRandom = (Boolean)(processing.random);
                    let content = processing.result;
                    if (typeof content == "object" && isRandom) {
                        content = content[Math.round(Math.random())];
                    }

                    content.trim();
                    input_value.trim()

                    if (/^https?:\/\//.test(content)) {
                        sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                        window.open(content, '_blank');
                        return;
                    }

                    if (/\.(pdf|jpeg|jpg|png|webm|webp)$/i.test(content)) {
                        sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                        window.open('../resources/' + content, '_blank');
                        return;
                    }

                    if (content === "EXIT()") {
                        let username = getCookie('user');
                        removeCookie('user');
                        removeCookie('last_webhook_time');
                        if (!getCookie('user') || !getCookie('last_webhook_time')) {
                            sendWebhook("SITE - SAIU", `O player: \`${username}\`\n\n**Saiu do site usando EXIT() !**`)
                            window.location.href = '../index.html';
                        } else {
                            console.log("Houve um erro");
                        }
                        return;
                    }

                    document.getElementById('displayText').innerHTML = content;
                    sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                    return;
                }
            }



            document.getElementById('displayText').textContent = "Tente novamente.";
        })
        .catch(error => console.error('Erro ao processar JSON:', error));
}

// Função para obter valor do cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return false;
}

// Função para remover o cookie
function removeCookie(name) {
    const cookie = name
    if (getCookie(cookie)) {
        document.cookie = `${cookie}=; max-age=0; path=/`;
    }
}


export default {
    sendWebhook,
    process,
    getCookie,
    removeCookie
}