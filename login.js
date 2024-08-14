// Libs

import funcoes from './funcoes.js';



// Verificar se o cookie do usuário está definido
document.addEventListener('DOMContentLoaded', function () {
    const user = funcoes.getCookie('user');
    
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
    }

    // Codificar o valor do cookie para garantir que espaços e caracteres especiais sejam tratados corretamente
    //document.cookie = `user=${(nick)}; max-age=${86400 * 30}; path=/`;

    // Enviar webhook de login
    //sendWebhook("SITE - LOGIN", `O player: \`${nick}\`\n**Entrou no site**.`);

    // Redirecionar para a página do site
    //window.location.href = 'site.html';


});



