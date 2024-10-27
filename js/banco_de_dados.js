const operadores = [
    { nome: "Julio Silva", senha: "julio1234#"},
    { nome: "Kauan Pereira", senha: "kauan1234#"},
    { nome: "Laiene Gomes", senha: "ABXC12#" },
    { nome: "Francileuda Batista", senha: "AFKC78@" },
    { nome: "Francisca Rosangela", senha: "3#F#HH8" },
    { nome: "Michelle Maria", senha: "8#9FG7@" },
    { nome: "Izabele Fernandes", senha: "IZbL89$" },
    { nome: "Roziane Domingo", senha: "RZdn34%" },
    { nome: "Silvania de Castro", senha: "SVdc67&" },
    { nome: "Tays Ferreira", senha: "TYfr56*" },
    { nome: "Andressiane Martins", senha: "ANmt45!" },
    { nome: "Camila do Carmo", senha: "CMdc90#" },
    { nome: "Luciana Gomes", senha: "LCgm78@" },
    { nome: "Vitoria Miranda", senha: "VTmr65$" },
    { nome: "Amanda Bezerra", senha: "AMbz43%" },
    { nome: "Jose Weskeley", senha: "JSwk21&" },
    { nome: "Francisco Wesley", senha: "FWsl10*" },
    { nome: "Ryan Anderson", senha: "RYan87!" },
    { nome: "Rodrigo Quinto", senha: "RDqt54#" },
    { nome: "Mateus Cavalcante", senha: "MTcv32@" },
    { nome: "Daniel Barbosa", senha: "DBrb19$" },
    { nome: "Nilson Ramos", senha: "NLrm76%" },
    { nome: "José Eduardo", senha: "JSEd53&" },
    { nome: "Fabrizio de Sousa", senha: "FBds41*" }
]

const maquinas = {
    SMT01: ["SM471A", "SM481B", "SM482A"],
    SMT02: ["SM471C", "SM481D", "SM481C", "SM482B"],
    SMT03: ["SM471B", "SM481A", "SM482C"]
};

const Feeders = {
    indiceF: Array.from({ length: 60 }, (_, i) => `F${i + 1}`),
    indiceR: Array.from({ length: 60 }, (_, i) => `R${i + 1}`)
}

export function buscarOperadorPorSenha(senha) {
    return operadores.find(operador => operador.senha === senha);
}

export function buscarTodasAsMaquinas() {
    return maquinas;
}

export function buscarTodosOsFeeders() {
    return Feeders
}

export function buscarTodosOsFeedersPorIndice(indice) {
    if (indice === 'F') {
        return Feeders.indiceF
    }

    return Feeders.indiceR
}