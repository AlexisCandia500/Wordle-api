window.addEventListener('load', init);
function init() {

    let intentos = 6;
    let diccionario = ['MADRE', 'HIJOS', 'PADRE', 'ADIOS'];
    let palabra = '';

    // Obtenemos una palabra aleatoria de la API
    fetch('https://random-word.ryanrk.com/api/en/word/random/?length=5')
        .then(response => response.json())
        .then(data => {
            palabra = data[0].toUpperCase();
            console.log('Palabra de la API:', palabra);
        })
        .catch(error => {
            console.error('Error al obtener la palabra:', error);
        });

    // Usamos local storage para guardar el puntaje
    // localStorage.setItem('puntos', ganado);
    // let puntos = localStorage.getItem('puntos');
    // let puntosInt = parseInt(puntos);
    // console.log(puntosInt); 

    // Definimos las constantes
    const button = document.getElementById("guess-button");
    const input = document.getElementById("guess-input");
    const ERROR = document.getElementById("error");
    const VIDA = document.getElementById("vida");
    VIDA.innerHTML = intentos;

    button.addEventListener('click', validarInput);
    input.addEventListener('keyup', (event) => {
        ERROR.innerHTML = "";
        input.style.borderColor = '#ccc';
        if (event.key === 'Enter') {
            validarInput();
        }
    });

    function validarInput() {
        const intento = leerIntento();
        const LETRAS = /^[a-zA-Z]+$/;
        if (intento.length > 5) {
            ERROR.innerHTML = "*Ingrese 5 caracteres";
            input.style.borderColor = 'red';
        } else if (!LETRAS.test(intento)) {
            ERROR.innerHTML = "*Solo se admite letras";
            input.style.borderColor = 'red';
        } else if (intento.length < 5) {
            ERROR.innerHTML = "*No agregaste todas las letras";
            input.style.borderColor = 'red';
        } else {
            ERROR.innerHTML = "";
            input.style.borderColor = '#ccc';
            intentar();
        }
    }

    function intentar() {
        const intento = leerIntento();
        const GRID = document.getElementById("grid");
        const ROW = document.createElement('div');
        ROW.className = 'row';

        if (intento === palabra || diccionario.includes(intento)) {
            for (let i in palabra) {
                const SPAN = document.createElement('div');
                SPAN.className = 'row-letter';

                if (intento[i] === palabra[i]) {
                    SPAN.innerHTML = intento[i];
                    SPAN.style.backgroundColor = '#79b851';
                    SPAN.style.border = '#79b851';
                }
                ROW.appendChild(SPAN);
            }

            GRID.appendChild(ROW);
            terminar("<h1>¡GANASTE!😀</h1>")
            return;
        } else {
            for (let i in palabra) {
                const SPAN = document.createElement('div');
                SPAN.className = 'row-letter';

                if (intento[i] === palabra[i]) {
                    SPAN.innerHTML = intento[i];
                    SPAN.style.backgroundColor = '#79b851';
                    SPAN.style.border = '#79b851';
                } else if (palabra.includes(intento[i])) {
                    SPAN.innerHTML = intento[i];
                    SPAN.style.backgroundColor = '#f3c237';
                    SPAN.style.border = '#f3c237';
                } else {
                    SPAN.innerHTML = intento[i];
                    SPAN.style.backgroundColor = '#a4aec4';
                    SPAN.style.border = '#a4aec4';
                }
                ROW.appendChild(SPAN);
            }

            GRID.appendChild(ROW);
            input.value = "";
            intentos--;
            VIDA.innerHTML = intentos;
            if (intentos == 0) {
                terminar("<h3>¡PERDISTE!😖 La palabra era " + palabra + "</h3>");
            }
        }
    }

    function terminar(mensaje) {
        input.disabled = true;
        let contenedor = document.getElementById('guesses');
        contenedor.innerHTML = mensaje;
        button.innerText = "Reiniciar";
        button.addEventListener("click", () => {
            GRID.innerHTML = "";
            location.reload();
        });
    }

    function leerIntento() {
        let intento = document.getElementById("guess-input").value;
        intento = intento.toUpperCase();
        return intento;
    }
}
