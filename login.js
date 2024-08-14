// Função para enviar o webhook
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

// Verificar se o cookie do usuário está definido
document.addEventListener('DOMContentLoaded', function () {
    const user = getCookie('user');

    if (user) {
       // sendWebhook("SITE - LOGIN", `O player: \`${user}\`\n**Entrou no site**.`);
        window.location.href = '../../site/';
    }

});

// Manipular o envio do formulário
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nick = document.getElementById('nick').value;
    const pwd = document.getElementById('password').value;

    // Temporario || Verificação de invasor!
    if (nick === "g4uradmins" || pwd === "g4uradmins") {
        document.cookie = `user=${(nick)}; max-age=${86400 * 30}; path=/`;
        //sendWebhook("SITE - LOGIN", `O player: \`${nick}\`\n**Entrou no site**.`);
        window.location.href = '../../site/';

    } else {
        window.location.href = '../../noauth/';
    }

    // Codificar o valor do cookie para garantir que espaços e caracteres especiais sejam tratados corretamente
    //document.cookie = `user=${(nick)}; max-age=${86400 * 30}; path=/`;

    // Enviar webhook de login
    //sendWebhook("SITE - LOGIN", `O player: \`${nick}\`\n**Entrou no site**.`);

    // Redirecionar para a página do site
    //window.location.href = 'site.html';


});

// Função para obter o valor do cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

