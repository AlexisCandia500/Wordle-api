window.addEventListener('load', init);

function init() {
    let intentos;
    let palabra = '';
    const diccionario = ['MADRE', 'HIJOS', 'PADRE', 'ADIOS'];
    const VIDA = document.getElementById("vida");
    const GRID = document.getElementById("grid");
    const ERROR = document.getElementById("error");
    const button = document.getElementById("guess-button");
    const input = document.getElementById("guess-input");
    const contenedorMensajes = document.getElementById('guesses'); // Contenedor de mensajes de fin del juego

    iniciarJuego();

    function iniciarJuego() {
        intentos = 6;
        VIDA.innerHTML = intentos;
        input.disabled = false;
        input.value = '';
        ERROR.innerHTML = '';
        contenedorMensajes.innerHTML = ''; // Limpiar el mensaje de fin del juego
        GRID.innerHTML = '';
        button.innerText = "Adivinar";
        button.removeEventListener('click', iniciarJuego);
        button.addEventListener('click', manejarIntento);
        input.addEventListener('keyup', (event) => {
            ERROR.innerHTML = "";
            input.style.borderColor = '#ccc';
            if (event.key === 'Enter') {
                manejarIntento();
            }
        });

        obtenerPalabra();
    }

    function obtenerPalabra() {
        palabra = generarPalabraAleatoria();
        console.log('Palabra generada:', palabra);
        input.disabled = false;
        input.value = '';
        input.focus();
    }

    function generarPalabraAleatoria() {
        if (Math.random() < 0.5) {
            // Generar palabra aleatoria desde la API
            return obtenerPalabraDesdeAPI();
        } else {
            // Seleccionar palabra aleatoria del diccionario
            return seleccionarPalabraDiccionario();
        }
    }

    function obtenerPalabraDesdeAPI() {
        return fetch('https://random-word.ryanrk.com/api/en/word/random/?length=5')
            .then(response => response.json())
            .then(data => {
                return data[0].toUpperCase();
            })
            .catch(error => {
                console.error('Error al obtener la palabra desde la API:', error);
                // Si falla la API, seleccionar una palabra del diccionario como fallback
                return seleccionarPalabraDiccionario();
            });
    }

    function seleccionarPalabraDiccionario() {
        const randomIndex = Math.floor(Math.random() * diccionario.length);
        return diccionario[randomIndex].toUpperCase();
    }

    function manejarIntento() {
        const intento = input.value.trim().toUpperCase();
        if (validarEntrada(intento)) {
            intentar(intento);
        }
    }

    function validarEntrada(intento) {
        const LETRAS = /^[a-zA-Z]+$/;
        if (intento.length !== 5) {
            mostrarError("*Ingrese exactamente 5 caracteres");
            return false;
        } else if (!LETRAS.test(intento)) {
            mostrarError("*Solo se admite letras");
            return false;
        }
        return true;
    }

    function intentar(intento) {
        const ROW = document.createElement('div');
        ROW.className = 'row';

        if (intento === palabra) {
            for (let i = 0; i < palabra.length; i++) {
                const SPAN = document.createElement('div');
                SPAN.className = 'row-letter';
                SPAN.innerHTML = intento[i];
                SPAN.style.backgroundColor = '#79b851';
                SPAN.style.border = '1px solid #79b851';
                ROW.appendChild(SPAN);
            }

            GRID.appendChild(ROW);
            terminar("<h1>¡GANASTE!😀</h1>");
        } else {
            for (let i = 0; i < palabra.length; i++) {
                const SPAN = document.createElement('div');
                SPAN.className = 'row-letter';

                if (intento[i] === palabra[i]) {
                    SPAN.innerHTML = intento[i];
                    SPAN.style.backgroundColor = '#79b851';
                    SPAN.style.border = '1px solid #79b851';
                } else if (palabra.includes(intento[i])) {
                    SPAN.innerHTML = intento[i];
                    SPAN.style.backgroundColor = '#f3c237';
                    SPAN.style.border = '1px solid #f3c237';
                } else {
                    SPAN.innerHTML = intento[i];
                    SPAN.style.backgroundColor = '#a4aec4';
                    SPAN.style.border = '1px solid #a4aec4';
                }
                ROW.appendChild(SPAN);
            }

            GRID.appendChild(ROW);
            input.value = "";
            intentos--;
            VIDA.innerHTML = intentos;
            if (intentos === 0) {
                terminar("<h3>¡PERDISTE!😖 La palabra era " + palabra + "</h3>");
            }
        }
    }

    function terminar(mensaje) {
        input.disabled = true;
        contenedorMensajes.innerHTML = mensaje;
        button.innerText = "Reiniciar";
        button.removeEventListener('click', manejarIntento);
        button.addEventListener("click", reiniciarJuego);
    }

    function reiniciarJuego() {
        iniciarJuego();
    }

    function mostrarError(mensaje) {
        ERROR.innerHTML = mensaje;
        input.style.borderColor = 'red';
    }
}