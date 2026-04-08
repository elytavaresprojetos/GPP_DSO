// Fix para GitHub Pages - Sobrescreve as funções de login com validação local
// Este arquivo deve ser carregado APÓS o app.js

(function() {
    'use strict';

    // Aguardar até que o DOM esteja completamente carregado e o app.js tenha sido executado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarFixLogin);
    } else {
        // DOM já foi carregado
        setTimeout(inicializarFixLogin, 100);
    }

    function inicializarFixLogin() {
        // Carregar usuários
        carregarUsuarios().then(() => {
            // Sobrescrever a função validarLogin
            window.validarLogin = function() {
                const usuario = document.getElementById('loginUser')?.value.trim();
                const senha = document.getElementById('loginPass')?.value;
                const loginError = document.getElementById('loginError');

                if (!usuario || !senha) {
                    if (loginError) {
                        loginError.textContent = 'Preencha usuário e senha.';
                    }
                    return;
                }

                // Validar credenciais localmente
                const usuarioValido = window.usuariosValidos?.find(u => u.username === usuario && u.password === senha);

                if (usuarioValido) {
                    // Login bem-sucedido
                    sessionStorage.setItem('spdataUser', usuario);
                    sessionStorage.setItem('spdataToken', 'token-' + Date.now());

                    // Limpar os campos
                    document.getElementById('loginUser').value = '';
                    document.getElementById('loginPass').value = '';
                    
                    // Se estiver em localhost, redirecionar para /dso
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        window.location.href = '/dso';
                    } else {
                        // Se estiver em GitHub Pages, apenas mostrar a tela principal
                        if (typeof mostrarAplicacao === 'function') {
                            mostrarAplicacao();
                        }
                        if (typeof iniciarAplicacao === 'function') {
                            iniciarAplicacao();
                        }
                    }
                } else {
                    if (loginError) {
                        loginError.textContent = 'Usuário ou senha inválidos.';
                    }
                }
            };

            // Configurar o listener do formulário
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                // Remover listeners anteriores clonando o elemento
                const newForm = loginForm.cloneNode(true);
                loginForm.parentNode.replaceChild(newForm, loginForm);
                
                // Adicionar novo listener com a função corrigida
                document.getElementById('loginForm').addEventListener('submit', function(event) {
                    event.preventDefault();
                    validarLogin();
                });
                
                console.log('Fix-login: Listeners configurados com sucesso');
            }
        });
    }

    function carregarUsuarios() {
        return fetch('users.json')
            .then(response => response.json())
            .then(data => {
                window.usuariosValidos = data.users || [];
                console.log('Fix-login: Usuários carregados de users.json');
                return true;
            })
            .catch(error => {
                console.warn('Fix-login: Não foi possível carregar usuários de users.json:', error);
                // Fallback com usuários padrão
                window.usuariosValidos = [
                    { username: 'ely.tavares', password: '123456' },
                    { username: 'pedro.nascimento', password: '123456' }
                ];
                console.log('Fix-login: Usando fallback de usuários padrão');
                return true;
            });
    }
})();
