// Primero traigo todo lo que necesito del html
var lenguaje = document.getElementById("lenguaje");
var mensaje = document.getElementById("mensaje");
var tarjeta = document.getElementById("tarjeta");
var botonRefresh = document.getElementById("botonRefresh");
var botonReintentar = document.getElementById("botonReintentar");

var nombre = document.getElementById("nombre");
var descripcion = document.getElementById("descripcion");
var estrellas = document.getElementById("estrellas");
var forks = document.getElementById("forks");
var issues = document.getElementById("issues");


// Estado vacío: cuando no han escogido lenguaje
function estadoVacio() {
    mensaje.style.display = "block";
    mensaje.style.backgroundColor = "#f3e5f5";
    mensaje.textContent = "Por favor selecciona un lenguaje";
    tarjeta.style.display = "none";
    botonRefresh.style.display = "none";
    botonReintentar.style.display = "none";
}

// Estado cargando: mientras espero a GitHub
function estadoCargando() {
    mensaje.style.display = "block";
    mensaje.style.backgroundColor = "#fce4ec";
    mensaje.textContent = "Cargando, por favor espera...";
    tarjeta.style.display = "none";
    botonRefresh.style.display = "none";
    botonReintentar.style.display = "none";
}

// Estado error: si algo sale mal
function estadoError() {
    mensaje.style.display = "block";
    mensaje.style.backgroundColor = "#ffcdd2";
    mensaje.textContent = "Error al buscar los repositorios";
    tarjeta.style.display = "none";
    botonRefresh.style.display = "none";
    botonReintentar.style.display = "block";
}

// Cuando todo sale bien, muestro el repositorio
function estadoListo(repo) {
    nombre.textContent = repo.name;

    if (repo.description == null) {
        descripcion.textContent = "Sin descripción";
    } else {
        descripcion.textContent = repo.description;
    }

    estrellas.textContent = repo.stargazers_count;
    forks.textContent = repo.forks_count;
    issues.textContent = repo.open_issues_count;

    mensaje.style.display = "none";
    tarjeta.style.display = "block";
    botonRefresh.style.display = "block";
    botonReintentar.style.display = "none";
}


// Esta es la función que busca el repositorio
async function buscarRepositorio() {

    // Si no hay lenguaje escogido no hago nada más
    if (lenguaje.value == "") {
        estadoVacio();
        return;
    }

    estadoCargando();

    try {
        // Escojo una página al azar del 1 al 10
        var pagina = Math.floor(Math.random() * 10) + 1;

        var url = "https://api.github.com/search/repositories?q=language:" + lenguaje.value + "&per_page=100&page=" + pagina;

        var respuesta = await fetch(url);

        // Si GitHub respondió mal, lo mando al error
        if (respuesta.ok == false) {
            estadoError();
            return;
        }

        var datos = await respuesta.json();

        // Escojo un repositorio al azar de los que llegaron
        var numero = Math.floor(Math.random() * datos.items.length);
        var repo = datos.items[numero];

        estadoListo(repo);

    } catch (error) {
        estadoError();
    }
}


// Cuando hacen clic o cambian el select, busco
lenguaje.addEventListener("change", buscarRepositorio);
botonRefresh.addEventListener("click", buscarRepositorio);
botonReintentar.addEventListener("click", buscarRepositorio);