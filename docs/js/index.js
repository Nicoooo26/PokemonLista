// Seleccionar elementos del DOM por su ID
const tbody = document.getElementById('pokemon-list');
const info = document.getElementById('info');
const botonSalir = document.getElementById('salir');
const nombrePokemon = document.getElementById('nombre');
const idPokemon = document.getElementById('id');
const habilidadesPokemon = document.getElementById('habilidades');
const imagenPokemon = document.querySelector('#pokemon-image img');
const cargando = document.getElementById('cargando');

// Evento para ocultar la información cuando se hace clic en el botón "Salir"
botonSalir.addEventListener("click", () => {
    info.classList.add('hidden');
});

// Evento que se ejecuta cuando se carga la ventana, realiza una solicitud a la PokeAPI
window.addEventListener('DOMContentLoaded', async () => {
    // Ocultar la información al inicio
    info.classList.add('hidden');

    try {
        // Obtener la lista de Pokémon desde la PokeAPI
        const respuesta = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=132`);
        const pokemonLista = respuesta.data.results;

        // Iterar sobre la lista de Pokémon y mostrar cada uno en una cuadrícula
        pokemonLista.forEach(async (pokemon) => {
            const pokemonDiv = document.createElement('div');
            pokemonDiv.classList.add('pokemon');

            // Crear una imagen del Pokémon y obtener la URL de la imagen usando otra función asincrónica
            const imagen = document.createElement('img');
            const imagenUrl = await getPokemonImage(pokemon.url);
            imagen.src = imagenUrl;
            pokemonDiv.appendChild(imagen);

            // Agregar un evento de clic para mostrar la información del Pokémon
            pokemonDiv.addEventListener("click", () => {
                // Mostrar un elemento de carga antes de mostrar la información completa
                cargando.style.display = 'block';
                // Retraso simulado de 2 segundos antes de mostrar la información
                setTimeout(() => {
                    cargando.style.display = 'none';
                    mostrarInformacionPokemon(pokemon.url);
                }, 2000);
            });

            tbody.appendChild(pokemonDiv);
        });
    } catch (e) {
        console.log(e);
    }
});

// Función asincrónica para obtener la URL de la imagen de un Pokémon
async function getPokemonImage(url) {
    const response = await axios.get(url);
    return response.data.sprites.front_default;
}

// Función asincrónica para mostrar información detallada de un Pokémon
async function mostrarInformacionPokemon(url) {
    try {
        // Realizar una solicitud a la PokeAPI para obtener información detallada del Pokémon
        const respuesta = await axios.get(url);
        const habilidades = respuesta.data.abilities;

        // Actualizar elementos en el DOM con la información del Pokémon
        imagenPokemon.src = respuesta.data.sprites.front_default;
        nombrePokemon.textContent = respuesta.data.name;
        idPokemon.textContent = respuesta.data.id;

        // Limpiar la lista de habilidades y agregar cada habilidad como un elemento de lista
        habilidadesPokemon.innerHTML = '';
        habilidades.forEach(async (habilidad, index) => {
            const abilityName = habilidad.ability.name;
            try {
                const li = document.createElement('li');
                li.textContent = `Habilidad ${index + 1}: ${abilityName}`;
                habilidadesPokemon.appendChild(li);
            } catch (e) {
                console.log(e);
            }
        });

        // Mostrar la información en el contenedor correspondiente
        info.classList.remove('hidden');
    } catch (e) {
        console.log(e);
    }
}
