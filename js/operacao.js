const buttonTroca = document.getElementById('buttonTroca');
const buttonDoubleCheck = document.getElementById('buttonDoubleCheck');

buttonTroca.addEventListener('click', function() {
    telaDeTroca();
});

buttonDoubleCheck.addEventListener('click', function() {
    telaDeDoubleCheck();
});

function telaDeTroca() {
    window.location.href = 'troca.html';
}

function telaDeDoubleCheck() {
    window.location.href = 'double_check.html';
}
