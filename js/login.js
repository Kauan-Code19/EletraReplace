import { buscarPorSenha } from './banco_de_dados.js';

const form = document.getElementById('loginForm');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    login(nome, senha)
});

function login(nome, senha) {
    const operador = buscarPorSenha(senha)

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

    telaDeTroca(operador)
}

function telaDeTroca(operador) {
    window.location.href = 'troca.html'
}