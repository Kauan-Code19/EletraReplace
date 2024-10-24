const maquinasPorLinha = {
    SMT01: ["SM471A", "SM481B", "SM482A"],
    SMT02: ["SM471C", "SM481D", "SM481C", "SM482B"],
    SMT03: ["SM471B", "SM481A", "SM482C"]
};

const linhaSelect = document.getElementById('linha');
const maquinaSelect = document.getElementById('maquina');

linhaSelect.addEventListener('change', function() {
    const linhaSelecionada = this.value;
    const maquinas = maquinasPorLinha[linhaSelecionada] || [];

    maquinaSelect.innerHTML = '<option value="" disabled selected>Selecione a máquina</option>';

    maquinas.forEach(maquina => {
        const option = document.createElement('option');
        option.value = maquina;
        option.textContent = maquina;
        maquinaSelect.appendChild(option);
    });
});

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

function compararPNs(pnDoComponenteUm, pnDoComponenteDois) {
    if (pnDoComponenteUm !== pnDoComponenteDois) {
        alert("As PNs são diferentes: " + pnDoComponenteUm + " vs " + pnDoComponenteDois);

        setarElementosComPNDiferente(pnDoComponenteUm, pnDoComponenteDois)

        return
    }

    alert("As PNs são iguais");

    setarElementosComPNIgual(pnDoComponenteUm)
}

function setarElementosComPNDiferente(pnDoComponenteUm, pnDoComponenteDois) {
    document.getElementById('verificarPNBtn').style.display = 'none';
    document.getElementById('pn1InputContainer').style.display = 'block'; 
    document.getElementById('pn1Input').value = pnDoComponenteUm;
    document.getElementById('pn1Input').ariaRequired = true; 
    document.getElementById('pn2InputContainer').style.display = 'block'; 
    document.getElementById('pn2Input').value = pnDoComponenteDois;
    document.getElementById('pn2Input').ariaRequired = true; 
    document.getElementById('observacaoContainer').style.display = 'block'; 
}

function setarElementosComPNIgual(pnDoComponenteUm) {
    document.getElementById('verificarPNBtn').style.display = 'none';
    document.getElementById('pnInputContainer').style.display = 'block'; 
    document.getElementById('pnInput').value = pnDoComponenteUm;
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
        return
    }

    if (valoresFormulario.pn1 && valoresFormulario.pn2) {  
        compartilharPdfComPNDiferente(pdfUrl, pdfBlob, valoresFormulario, dataHoraFormatada)
        return
    }
})

function pegarValoresDoFormulario() {
    let operadorString = sessionStorage.getItem('operador');
    let operador = operadorString ? JSON.parse(operadorString) : null;

    return {
        operador: operador ? operador.nome : '',
        ordemProducao: document.getElementById('ordemProducao').value,
        turno: document.getElementById('turno').value,
        linha: document.getElementById('linha').value,
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