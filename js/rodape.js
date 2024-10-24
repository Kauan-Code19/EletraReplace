function carregarRodape() {
    fetch('rodape.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o rodapé:', error));
}

document.addEventListener('DOMContentLoaded', carregarRodape);
