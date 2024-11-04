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
const numeroFeederSelect = document.getElementById('numeroFeeder');

if (numeroFeederSelect) {
    preencherFeeders(feeders)
}

function preencherFeeders(feeders) {
    const feedersF = feeders["indiceF"] || []
    const feedersR = feeders["indiceR"] || []
    numeroFeederSelect.innerHTML = '<option value="" disabled selected>Selecione o Número do Feeder</option>';

    feedersF.forEach(numeroFeeder => {
        const option = document.createElement('option');
        option.value = numeroFeeder;
        option.textContent = numeroFeeder;
        numeroFeederSelect.appendChild(option);
    });

    feedersR.forEach(numeroFeeder => {
        const option = document.createElement('option');
        option.value = numeroFeeder;
        option.textContent = numeroFeeder;
        numeroFeederSelect.appendChild(option);
    });
}

maquinaSelect.addEventListener('change', MostarButtonPn);
numeroFeederSelect.addEventListener('change', MostarButtonPn);

function MostarButtonPn() {

    if (maquinaSelect.value == '' || numeroFeederSelect.value == '') {
        return
    }

    document.getElementById("verificarPNBtn1").style.display = ''
    document.getElementById('buttonTroca').style.display = ''
    document.getElementById('buttonTroca').disabled = true
}

let html5QrCode;
let pns = {
    componenteUm: null,
    componenteDois: null
};

document.getElementById('verificarPNBtn1').addEventListener('click', () => {
    if (!pns.componenteUm && !html5QrCode) {
        document.getElementById('title').style.display = 'none'
        document.getElementById('divMaquina').style.display = 'none'
        document.getElementById('divFeeder').style.display = 'none'
        iniciarLeituraQrCode(1);
        document.getElementById('verificarPNBtn2').style.display = ''
        document.getElementById('verificarPNBtn1').style.display = 'none'
    }
});

document.getElementById('verificarPNBtn2').addEventListener('click', () => {
    document.getElementById('title').style.display = 'none'
    document.getElementById('divMaquina').style.display = 'none'
    document.getElementById('divFeeder').style.display = 'none'
    iniciarLeituraQrCode(2); 
    document.getElementById('verificarPNBtn2').style.display = 'none'
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

                if (pns.componenteUm == "") {
                    alert("PN do componente anterior esta vazio")
                } else {
                    alert("PN do Componente Anterior: " + pns.componenteUm);
                }

            } else if (componente === 2) {
                pns.componenteDois = partes[5] || ""; 

                if (pns.componenteDois == "") {
                    alert("PN do componente novo esta vazio")
                } else {
                    alert("PN do Componente Novo: " + pns.componenteDois);
                }
            }

            if (componente === 2) {
                compararPNs(pns.componenteUm, pns.componenteDois)
            }
            
            html5QrCode.stop();

        },
        errorMessage => {
            console.log("QR Code não lido: " + errorMessage);
        }
    ).catch(err => {
        console.error("Erro ao iniciar QR Code Scanner:", err);
    });
}

var PnIgual = true

function compararPNs(pnDoComponenteAnterior, pnDoComponenteNovo) {
    if (pnDoComponenteAnterior !== pnDoComponenteNovo) {
        document.getElementById('divMaquina').style.display = ''
        document.getElementById('divFeeder').style.display = ''

        setarElementosComPNDiferente(pnDoComponenteAnterior, pnDoComponenteNovo)
        setPnIgualTrueFalse(false)

        var myModal = new bootstrap.Modal(document.getElementById('exampleModalWarning'));
        
        const alertElement = document.getElementById('alertMessageWarning');
        alertElement.querySelector('div').textContent = "AS PNS NÃO COINCIDEM";
        myModal.show();

        return
    }

    document.getElementById('divMaquina').style.display = ''
    document.getElementById('divFeeder').style.display = ''

    setarElementosComPNIgual(pnDoComponenteAnterior)
    setPnIgualTrueFalse(true)

    if (PnIgual) {
        var myModal = new bootstrap.Modal(document.getElementById('exampleModalSuccess'));
        
        const alertElement = document.getElementById('alertMessageSuccess');

        alertElement.querySelector('div').textContent = "AS PNS COINCIDEM";

        myModal.show();
    }

    habilitarButtonTroca()
}

function setPnIgualTrueFalse(value) {
    if (value == true) {
        return
    }

    PnIgual == false
}

function habilitarButtonTroca() {
    document.getElementById('buttonTroca').disabled = false
}

function setarElementosComPNDiferente(pnDoComponenteAnterior, pnDoComponenteNovo) {
    document.getElementById('pn1InputContainer').style.display = 'block'; 
    document.getElementById('pn1Input').value = pnDoComponenteAnterior;
    document.getElementById('pn1Input').required = true;

    if (pnDoComponenteAnterior == '') {
        document.getElementById('pn1Input').readOnly = false;
    }

    document.getElementById('pn2InputContainer').style.display = 'block'; 
    document.getElementById('pn2Input').value = pnDoComponenteNovo;
    document.getElementById('pn2Input').required = true; 

    if (pnDoComponenteNovo == '') {
        document.getElementById('pn2Input').readOnly = false;
    }

    document.getElementById('observacaoContainer').style.display = 'block';
    document.getElementById('divQuantidade').style.display = 'block';
}

function setarElementosComPNIgual(pnDoComponenteAnterior) {
    document.getElementById('pnInputContainer').style.display = 'block'; 
    document.getElementById('pnInput').value = pnDoComponenteAnterior;
    document.getElementById('pnInput').required = true;
    document.getElementById('observacao').required = false
    document.getElementById('divQuantidade').style.display = 'block';
}

document.getElementById('observacao').addEventListener('click', habilitarButtonTroca)

const selectQuantidade = document.getElementById('quantidade');

selectQuantidade.addEventListener('change', () => {
    if (!selectQuantidade.value == 'naoCheio') {
        return
    }

    document.getElementById('divQuantidade').style.display = 'none';

    document.getElementById('divNumeroQuantidade').style.display = 'block';
})

document.getElementById('producaoForm').addEventListener('submit', async(event) => {
    event.preventDefault()

    let valoresFormulario = pegarValoresDoFormulario()

    const dataHoraFormatada = formatarDataHora();
    
    let pdfBlob =  criarPdfBlob(valoresFormulario, dataHoraFormatada)

    if (valoresFormulario.pnIguais) {
        compartilharPdfComPN(pdfBlob, valoresFormulario, dataHoraFormatada, 'igual');
        setTimeout(() => {
            window.location.href = 'troca.html';
        }, 3000); 
        return;
    }
    
    if (valoresFormulario.pn1 && valoresFormulario.pn2) {
        compartilharPdfComPN(pdfBlob, valoresFormulario, dataHoraFormatada, 'diferente');
        setTimeout(() => {
            window.location.href = 'troca.html';
        }, 3000);
        return;
    }
})


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
        observacao: document.getElementById('observacao').value,
        quantidadeCheio: document.getElementById('quantidade').value,
        quantidadeNaoCheio: document.getElementById('numeroQuantidade').value
    };
}

function criarPdfBlob(valoresFormulario, dataHoraFormatada) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let documentComText = definirTextDoFormulario(doc, valoresFormulario, dataHoraFormatada)

    const pdfBlob = documentComText.output('blob');
    return pdfBlob
}

function definirTextDoFormulario(doc, valoresFormulario, dataHoraFormatada) {
    doc.text(`Ordem de Produção: ${valoresFormulario.ordemProducao}`, 10, 10);
    doc.text(`Turno: ${valoresFormulario.turno}`, 10, 20);
    doc.text(`Data/Hora: ${dataHoraFormatada}`, 10, 30);
    doc.text(`Operador: ${valoresFormulario.operador}`, 10, 40);
    doc.text(`Linha: ${valoresFormulario.linha}`, 10, 50);
    doc.text(`Máquina: ${valoresFormulario.maquina}`, 10, 60);
    doc.text(`Número do Feeder: ${valoresFormulario.numeroFeeder}`, 10, 70);

    if (valoresFormulario.quantidadeCheio == "Cheio") {
        doc.text(`Quantidade: ${valoresFormulario.quantidadeCheio}`, 10, 80)
    } else {
        doc.text(`Quantidade: ${valoresFormulario.quantidadeNaoCheio}`, 10, 80)
    }

    if (valoresFormulario.pnIguais) {
        doc.text(`Part Number: ${valoresFormulario.pnIguais}`, 10, 90);
    }

    if (valoresFormulario.pn1 && valoresFormulario.pn2) {
        doc.text(`Part Number 1: ${valoresFormulario.pn1}`, 10, 90);
        doc.text(`Part Number 2: ${valoresFormulario.pn2}`, 10, 100);
    }

    if (valoresFormulario.observacao) {
        doc.text(`Observação: ${valoresFormulario.observacao}`, 10, 110);
    }

    return doc
}


async function compartilharPdfComPN(pdfBlob, valoresFormulario, dataHoraFormatada, tipoPN) {

    const botToken = "7217688430:AAG7f_TWBTEfPC9A6c6L9oZkv6_pCTSdATM";
    const chatId = "-4553940418";
    const url = `https://api.telegram.org/bot${botToken}/sendDocument`;

    const nomeArquivo = tipoPN === 'igual' 
        ? `OP${valoresFormulario.ordemProducao}_PN${valoresFormulario.pnIguais}_dataHora${dataHoraFormatada}.pdf`
        : `OP${valoresFormulario.ordemProducao}_PN1${valoresFormulario.pn1}_PN2${valoresFormulario.pn2}_dataHora${dataHoraFormatada}.pdf`;        

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', pdfBlob, nomeArquivo);

    try {
        // Envia o PDF para o bot
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });
        
        if (response.ok) {
            var myModal = new bootstrap.Modal(document.getElementById('exampleModalSuccess'));
        
            const alertElement = document.getElementById('alertMessageSuccess');

            alertElement.querySelector('div').textContent = "TROCA REGISTRADA COM SUCESSO";

            myModal.show();
        } else {
            var myModal = new bootstrap.Modal(document.getElementById('exampleModalWarning'));
        
            const alertElement = document.getElementById('alertMessageWarning');
            alertElement.querySelector('div').textContent = "FALHA AO TENTAR REGISTRAR TROCA";
            myModal.show();
        }
    } catch (error) {
        alert("Erro ao enviar o PDF: " + error.message);
    }
}

function formatarDataHora() {
    const data = new Date();
    const opcoes = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    return data.toLocaleString('pt-BR', opcoes).replace(/\//g, '-').replace(',', '');
}