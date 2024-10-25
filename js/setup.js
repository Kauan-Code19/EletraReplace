const formSetup = document.getElementById('setupForm');

formSetup.addEventListener('submit', function(event) {
    event.preventDefault();

    const op =  document.getElementById('ordemProducao').value
    const turno = document.getElementById('turno').value
    const linha = document.getElementById('linha').value

    sessionStorage.setItem('op', op)
    sessionStorage.setItem('turno', turno)
    sessionStorage.setItem('linha', linha)

    telaDeTroca()
});

function telaDeTroca() {
    window.location.href = 'troca.html'
}