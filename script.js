const API = "https://pokeapi.co/api/v2/pokemon";
const TOTAL_POKES = 50;

const tiposCor = {
    normal: "rgb(128, 128, 128)",
    grass: "rgb(60, 182, 44)",
    fire: "rgb(245, 142, 73)",
    water: "rgb(25, 159, 248)",
    bug: "rgb(61, 199, 33)",
    electric: "rgb(248, 207, 25)",
    rock: "rgb(243, 186, 64)",
    ghost: "rgb(143, 5, 131)",
    poison: "rgb(197, 35, 176)",
    psychic: "rgb(222, 113, 255)",
    fighting: "rgb(189, 85, 16)",
    ground: "rgb(212, 187, 43)",
    dragon: "rgb(248, 114, 25)",
};

let allPokes = [];
let filtroAtivo = null;

// elementos importantes
const nav = document.querySelector("nav");
const acharPoke = document.querySelector(".search-input");
const sort = document.querySelector(".select-filter select");
const clickTypes = document.querySelectorAll(".click-type");

// quando nn é usado asynch function devemos utilizar .then() para dizer q tem q esperar a internet carregar os dados
function fetchPokemonsLista(qtd) {
    return fetch('${API}?limit=${qtd}') // ${} coloca var na string
        .then(res => {
            if(!res.ok){
                throw new Error("Não foi possivel pegar seu recurso!");
            }
            return res.json();
        })
        .then(data => data.results)
        .catch(error => console.error(error));
}

async function fetchPokeDetalhar(url) {
    const res = await fetch(url);
    return res.json();
}

async function loadAllPokemons() {
    nav.innerHTML = `
  <img src="https://media.tenor.com/fSsxftCb8w0AAAAj/pikachu-running.gif" style="grid-column: 1/-1; margin: 0 auto; display:block; width:55px;" alt="Carregando...">
  <p style='grid-column: 1/-1; text-align:center; color:black; font-family: Minecraft;'>Carregando pokémons...</p>
`;


}

loadAllPokemons();