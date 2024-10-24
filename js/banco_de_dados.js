const operadores = [
    { nome: "Julio Silva", senha: "julio1234#"},
    { nome: "Kauan Pereira", senha: "kauan1234#"},
    { nome: "Laiene Gomes da Silva", senha: "laiene1234#"},
    { nome: "Francileuda Batista de Miranda", senha: "franci1234#"},
    { nome: "Francisca Rosangela Lopes de Oliveira", senha: "francisca1234#"},
    { nome: "Michelle Maria da Silva", senha: "michelle1234#"},
    { nome: "Izabele Fernandes Veras", senha: "izabele1234#"},
    { nome: "Roziane da Silva Domingo", senha: "roziane1234#"},
    { nome: "Silvania de Castro Silva", senha: "silvania1234#"},
    { nome: "Tays Ferreira Lopes", senha: "tays1234#"},
    { nome: "Andressiane Martins de Oliveira Pereira", senha: "andressiane1234#"},
    { nome: "Camila do Carmo Santos", senha: "camila1234#"},
    { nome: "Luciana Gomes de Lima", senha: "luciana1234#"},
    { nome: "Vitoria da Silva Miranda", senha: "vitoria1234#"},
    { nome: "Amanda da Silva Bezerra", senha: "amanda1234#"},
    { nome: "Jose Weskeley de Oliveira Machado", senha: "jose1234#"},
    { nome: "Francisco Wesley da Silva Figueiredo", senha: "francisco1234#"},
    { nome: "Ryan Anderson Teixeira de Sousa", senha: "ryan1234#"},
    { nome: "Rodrigo Quinto Moreira", senha: "rodrigo1234#"},
    { nome: "Mateus Cavalcante dos Santos", senha: "mateus1234#"},
    { nome: "Daniel Barbosa da Silva", senha: "daniel1234#"},
    { nome: "Nilson Ramos de Souza Filho", senha: "nilson1234#"},
    { nome: "José Eduardo Alves Rocha", senha: "joseeduardo1234#"},
    { nome: "Fabrizio de Sousa Silva", senha: "fabrizio1234#"},
];

export function buscarPorSenha(senha) {
    return operadores.find(operador => operador.senha === senha);
}
