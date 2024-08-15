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
    getCookie,
    removeCookie
}