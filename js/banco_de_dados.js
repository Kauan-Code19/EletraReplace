const operadores = [
    { nome: "Carlos Silva", senha: "111.222.333-44"},
    { nome: "Kauan Pereira", senha: "kauan1234#"},
];

function adicionarOperador(nome, senha, turno) {
    operadores.push({ nome, senha, turno });
    alert(`Operador ${nome} adicionado com sucesso!`);
}

function buscarPorTurno(turno) {
    return operadores.filter(operador => operador.turno === turno);
}

export function buscarPorSenha(senha) {
    return operadores.find(operador => operador.senha === senha);
}
