import { buscarTodasAsMaquinas, buscarTodosOsFeeders } from "./banco_de_dados.js";

const maquinas = buscarTodasAsMaquinas()
const linhaSessionStorage = sessionStorage.getItem('linha');
const maquinaSelect = document.getElementById('maquina');

if (linhaSessionStorage) {
    document.getElementById('linha').value = linhaSessionStorage;
    preencherMaquinas(linhaSessionStorage);
}

function preencherMaquinas(linhaSelecionada) {
    const maquinasPorLinha = maquinas[linhaSelecionada] || [];
    maquinaSelect.innerHTML = '<option value="" disabled selected>Selecione a máquina</option>';

    maquinasPorLinha.forEach(maquina => {
        const option = document.createElement('option');
        option.value = maquina;
        option.textContent = maquina;
        maquinaSelect.appendChild(option);
    });
}

const feeders = buscarTodosOsFeeders()
const indiceFeederSelect = document.getElementById('indiceFeeder');
const numeroFeederSelect = document.getElementById('numeroFeeder');

indiceFeederSelect.addEventListener('change', function() {
    const indiceSelecionado = this.value;
    const feedersPorIndice = feeders[indiceSelecionado] || [];

    numeroFeederSelect.innerHTML = '<option value="" disabled selected>Selecione o Número do Feeder</option>';

    feedersPorIndice.forEach(numeroFeeder => {
        const option = document.createElement('option');
        option.value = numeroFeeder;
        option.textContent = numeroFeeder;
        numeroFeederSelect.appendChild(option);
    });
})

let html5QrCode;
let pns = {
    componenteUm: null,
    componenteDois: null
};

document.getElementById('verificarPNBtn').addEventListener('click', () => {
    if (!pns.componenteUm && !html5QrCode) {
        iniciarLeituraQrCode(1);
        return;
    }

    iniciarLeituraQrCode(2); 
});

function iniciarLeituraQrCode(componente) {    

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    html5QrCode.start(
        { facingMode: "environment" }, 
        {
            fps: 10,
            qrbox: 250
        },
        qrCodeMessage => {
            const partes = qrCodeMessage.split(" ");
            
            if (componente === 1) {
                pns.componenteUm = partes[5] || ""; 

                alert("PN do Componente 1: " + pns.componenteUm);

            } else if (componente === 2) {
                pns.componenteDois = partes[5] || ""; 
                
                alert("PN do Componente 2: " + pns.componenteDois);
            }
            
            html5QrCode.stop();

            if (pns.componenteUm && pns.componenteDois) {
                compararPNs(pns.componenteUm, pns.componenteDois);
            }
        },
        errorMessage => {
            console.log("QR Code não lido: " + errorMessage);
        }
    ).catch(err => {
        console.error("Erro ao iniciar QR Code Scanner:", err);
    });
}

function compararPNs(pnDoComponenteAnterior, pnDoComponenteNovo) {
    if (pnDoComponenteAnterior !== pnDoComponenteNovo) {
        alert("As PNs são diferentes: " + pnDoComponenteAnterior + " vs " + pnDoComponenteNovo);

        setarElementosComPNDiferente(pnDoComponenteAnterior, pnDoComponenteNovo)

        return
    }

    setarElementosComPNIgual(pnDoComponenteAnterior)
}

function setarElementosComPNDiferente(pnDoComponenteAnterior, pnDoComponenteNovo) {
    document.getElementById('pn1InputContainer').style.display = 'block'; 
    document.getElementById('pn1Input').value = pnDoComponenteAnterior;
    document.getElementById('pn1Input').ariaRequired = true; 
    document.getElementById('pn2InputContainer').style.display = 'block'; 
    document.getElementById('pn2Input').value = pnDoComponenteNovo;
    document.getElementById('pn2Input').ariaRequired = true; 
    document.getElementById('observacaoContainer').style.display = 'block'; 
}

function setarElementosComPNIgual(pnDoComponenteAnterior) {
    document.getElementById('pnInputContainer').style.display = 'block'; 
    document.getElementById('pnInput').value = pnDoComponenteAnterior;
    document.getElementById('pnInput').ariaRequired = true;
}

document.getElementById('producaoForm').addEventListener('submit', async(event) => {
    event.preventDefault()

    let valoresFormulario = pegarValoresDoFormulario()

    const dataHoraFormatada = formatarDataHora();
    
    let pdfUrl = criarPdfUrl(valoresFormulario, dataHoraFormatada)
    let pdfBlob =  criarPdfBlob(valoresFormulario, dataHoraFormatada)

    if (valoresFormulario.pnIguais) {
        compartilharPdfComPNIgual(pdfUrl, pdfBlob, valoresFormulario, dataHoraFormatada)
        limparFormulario()
        return
    }

    if (valoresFormulario.pn1 && valoresFormulario.pn2) {  
        compartilharPdfComPNDiferente(pdfUrl, pdfBlob, valoresFormulario, dataHoraFormatada)
        limparFormulario()
        return
    }
})

function limparFormulario() {
    document.getElementById('maquina').value = '';
    document.getElementById('numeroFeeder').value = '';
    document.getElementById('pnInput').value = '';
    document.getElementById('pn1Input').value = '';
    document.getElementById('pn2Input').value = '';
    document.getElementById('observacao').value = '';
}

function pegarValoresDoFormulario() {
    let operadorString = sessionStorage.getItem('operador');
    let operador = operadorString ? JSON.parse(operadorString) : null;
    let op = sessionStorage.getItem('op')
    let turno = sessionStorage.getItem('turno')
    let linha = sessionStorage.getItem('linha')

    return {
        operador: operador ? operador.nome : '',
        ordemProducao: op,
        turno: turno,
        linha: linha,
        maquina: document.getElementById('maquina').value,
        numeroFeeder: document.getElementById('numeroFeeder').value,
        pnIguais: document.getElementById('pnInput').value,
        pn1: document.getElementById('pn1Input').value,
        pn2: document.getElementById('pn2Input').value,
        observacao: document.getElementById('observacao').value
    };
}

function criarPdfBlob(valoresFormulario, dataHoraFormatada) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let documentComText = definirTextDoFormulario(doc, valoresFormulario, dataHoraFormatada)

    const pdfBlob = documentComText.output('blob');
    return pdfBlob
}

function criarPdfUrl(valoresFormulario, dataHoraFormatada) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let documentComText = definirTextDoFormulario(doc, valoresFormulario, dataHoraFormatada)

    const pdfBlob = documentComText.output('blob');
    return URL.createObjectURL(pdfBlob)
}

function definirTextDoFormulario(doc, valoresFormulario, dataHoraFormatada) {
    doc.text(`Ordem de Produção: ${valoresFormulario.ordemProducao}`, 10, 10);
    doc.text(`Turno: ${valoresFormulario.turno}`, 10, 20);
    doc.text(`Data/Hora: ${dataHoraFormatada}`, 10, 30);
    doc.text(`Operador: ${valoresFormulario.operador}`, 10, 40);
    doc.text(`Linha: ${valoresFormulario.linha}`, 10, 50);
    doc.text(`Máquina: ${valoresFormulario.maquina}`, 10, 60);
    doc.text(`Número do Feeder: ${valoresFormulario.numeroFeeder}`, 10, 70);

    if (valoresFormulario.pnIguais) {
        doc.text(`Part Number: ${valoresFormulario.pnIguais}`, 10, 80);
    }

    if (valoresFormulario.pn1 && valoresFormulario.pn2) {
        doc.text(`Part Number 1: ${valoresFormulario.pn1}`, 10, 80);
        doc.text(`Part Number 2: ${valoresFormulario.pn2}`, 10, 90);
    }

    if (valoresFormulario.observacao) {
        doc.text(`Observação: ${valoresFormulario.observacao}`, 10, 100);
    }

    return doc
}

function compartilharPdfComPNIgual(pdfUrl, pdfBlob, valoresFormulario, dataHoraFormatada) {    
    if (navigator.share) {
        navigator.share({
            title: 'Registro de Troca',
            files: [new File([pdfBlob], 
                `OP${valoresFormulario.ordemProducao}_PN${valoresFormulario.pnIguais}
                _dataHora${dataHoraFormatada}.pdf`, { type: 'application/pdf' })]
        }).catch(error => console.error('Erro ao compartilhar:', error));
    } else {
        alert("O compartilhamento não é suportado neste navegador.");
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `OP${valoresFormulario.ordemProducao}_PN${valoresFormulario.pnIguais}
        _dataHora${dataHoraFormatada}.pdf`
        link.click();
    }
}

function compartilharPdfComPNDiferente(pdfUrl, pdfBlob, valoresFormulario, dataHoraFormatada) {
    if (navigator.share) {
        navigator.share({
            title: 'Registro de Troca',
            files: [new File([pdfBlob], 
                `OP${valoresFormulario.ordemProducao}_PN1${valoresFormulario.pn1}
                _PN2${valoresFormulario.pn2}_dataHora${dataHoraFormatada}.pdf`, { type: 'application/pdf' })]
        }).catch(error => console.error('Erro ao compartilhar:', error));
    } else {
        alert("O compartilhamento não é suportado neste navegador.");
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `_OP${valoresFormulario.ordemProducao}_PN1${valoresFormulario.pn1}
        _PN2${valoresFormulario.pn2} dataHora${dataHoraFormatada}.pdf`
        link.click();
    }
}

function formatarDataHora() {
    const data = new Date();
    const opcoes = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    return data.toLocaleString('pt-BR', opcoes).replace(/\//g, '-').replace(',', '');
}