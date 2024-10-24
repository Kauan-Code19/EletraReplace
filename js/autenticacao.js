function estaAutenticado() {
    const operador = sessionStorage.getItem('operador')

    if (operador) {
        return
    }

    window.location.href = 'index.html'
}

window.onload = estaAutenticado