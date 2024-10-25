const buttonTroca = document.getElementById('buttonTroca');
const buttonDoubleCheck = document.getElementById('buttonDoubleCheck');

buttonTroca.addEventListener('click', function() {
    telaDeSetup();
});

buttonDoubleCheck.addEventListener('click', function() {
    telaDeDoubleCheck();
});

function telaDeSetup() {
    window.location.href = 'setup.html';
}

function telaDeDoubleCheck() {
    window.location.href = 'double_check.html';
}
