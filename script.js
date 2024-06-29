window.addEventListener('load', init);

function init() {
    let intentos;
    let palabra = '';
    const diccionario = ['MADRE', 'ADIOS'];
    const VIDA = document.getElementById("vida");
    const GRID = document.getElementById("grid");
    const ERROR = document.getElementById("error");
    const button = document.getElementById("guess-button");
    const input = document.getElementById("guess-input");
    const contenedorMensajes = document.getElementById('guesses');

    iniciarJuego();

    function iniciarJuego() {
        intentos = 6;
        palabra = '';
        VIDA.innerHTML = intentos;
        input.disabled = false;
        input.value = '';
        ERROR.innerHTML = '';
        contenedorMensajes.innerHTML = '';
        GRID.innerHTML = '';
        button.innerText = "Adivinar";
        button.removeEventListener('click', reiniciarJuego);
        button.addEventListener('click', validarInput);
        input.addEventListener('keyup', manejarEnter);

        obtenerPalabraDesdeAPI();
        mostrarMensajeInicial();
    }

    function mostrarMensajeInicial() {
        alert("Bienvenido a Wordle PPY.\n Tienes 6 vidas 😄 \n\n" +
              "Si la casilla se pone en verde, la letra está en la ubicación correcta. 🟩 \n" +
              "Si la casilla se pone amarilla, la letra está en la palabra pero en posición equivocada. 🟨");
    }

    function obtenerPalabraDesdeAPI() {
        fetch('https://random-word.ryanrk.com/api/en/word/random/?length=5')
            .then(response => response.json())
            .then(data => {
                palabra = data[0].toUpperCase();
                console.log('Palabra de la API:', palabra);
            })
            .catch(error => {
                console.error('Error al obtener la palabra desde la API:', error);
                // En caso de error, se elige una palabra del diccionario
                palabra = seleccionarPalabraDeDiccionario();
                console.log('Palabra seleccionada del diccionario:', palabra);
            });
    }

    function seleccionarPalabraDeDiccionario() {
        const randomIndex = Math.floor(Math.random() * diccionario.length);
        return diccionario[randomIndex].toUpperCase();
    }

    function manejarEnter(event) {
        if (event.key === 'Enter') {
            validarInput();
        }
    }

    function validarInput() {
        const intento = leerIntento().trim();
        const LETRAS = /^[a-zA-Z]+$/;
        if (intento.length !== 5) {
            ERROR.innerHTML = "*Ingrese exactamente 5 caracteres";
            input.style.borderColor = 'red';
        } else if (!LETRAS.test(intento)) {
            ERROR.innerHTML = "*Solo se admite letras";
            input.style.borderColor = 'red';
        } else {
            ERROR.innerHTML = "";
            input.style.borderColor = '#ccc';
            intentar(intento);
        }
    }

    function intentar(intento) {
        const ROW = document.createElement('div');
        ROW.className = 'row';

        if (intento === palabra || diccionario.includes(intento)) {
            for (let i = 0; i < palabra.length; i++) {
                const SPAN = document.createElement('div');
                SPAN.className = 'row-letter';
                SPAN.innerHTML = intento[i];
                if (intento[i] === palabra[i]) {
                    SPAN.classList.add('green');
                } else if (palabra.includes(intento[i])) {
                    SPAN.classList.add('yellow');
                }
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
                    SPAN.classList.add('green');
                } else if (palabra.includes(intento[i])) {
                    SPAN.innerHTML = intento[i];
                    SPAN.classList.add('yellow');
                } else {
                    SPAN.innerHTML = intento[i];
                }
                ROW.appendChild(SPAN);
            }

            GRID.appendChild(ROW);
            input.value = "";
            intentos--;
            VIDA.innerHTML = intentos;
            if (intentos === 0) {
                terminar("<h3>¡PERDISTE!🙁 La palabra era " + palabra + "</h3>");
            }
        }
    }

    function terminar(mensaje) {
        input.disabled = true;
        contenedorMensajes.innerHTML = mensaje;
        button.innerText = "Reiniciar";
        button.removeEventListener('click', validarInput);
        button.addEventListener("click", reiniciarJuego);
    }

    function reiniciarJuego() {
        button.removeEventListener('click', validarInput);
        input.removeEventListener('keyup', manejarEnter);
        iniciarJuego();
    }

    function leerIntento() {
        let intento = input.value.trim().toUpperCase();
        return intento;
    }
}
