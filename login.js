// Libs
import data from './dataModule.js';
import webhook from './libs/webhook/webhook.js';

const Hook = new webhook.Webhook("https://discord.com/api/webhooks/1273020022800781494/Y8Ib_CCKtaui7yNP6DZysUSlbx1xxZySc6g5FlhwiOUIOTJmzTjbiV8VICC75911gaS_")


// Verificar se o cookie do usuário está definido
document.addEventListener('DOMContentLoaded', function () {
    const user = data.getCookie('user');
    
    if (user) {
       // sendWebhook("SITE - LOGIN", `O player: \`${user}\`\n**Entrou no site**.`);
       window.location.href = '../site/';
       console.log("testing")
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
        window.location.href = '../site/';

    } else {
        window.location.href = '../noauth/';
        console.log("testing 2")
        Hook.info("teste", "infu")
    }

    // Codificar o valor do cookie para garantir que espaços e caracteres especiais sejam tratados corretamente
    //document.cookie = `user=${(nick)}; max-age=${86400 * 30}; path=/`;

    // Enviar webhook de login
    //sendWebhook("SITE - LOGIN", `O player: \`${nick}\`\n**Entrou no site**.`);

    // Redirecionar para a página do site
    //window.location.href = 'site.html';


});



