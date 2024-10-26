import { buscarOperadorPorSenha } from './banco_de_dados.js';

const formLogin = document.getElementById('loginForm');

formLogin.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    login(nome, senha)
});

function login(nome, senha) {
    const operador = buscarOperadorPorSenha(senha)

    if (!operador) {
        alert("Operador não registrado")
        return
    }

    if (operador.nome !== nome) {
        alert("Nome incorreto para a senha fornecida")
        return
    }

    alert("Login bem-sucedido!")

    sessionStorage.setItem('operador', JSON.stringify(operador));

    telaDeOperacao()
}

function telaDeOperacao() {
    window.location.href = 'setup.html'
}