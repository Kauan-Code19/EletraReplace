function estaAutenticado() {
    const operador = sessionStorage.getItem('operador')

    if (operador) {
        return
    }

    window.location.href = '../html/login.html'
}

window.onload = estaAutenticado