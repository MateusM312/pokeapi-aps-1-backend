const API = "https://pokeapi.co/api/v2/pokemon";
const TOTAL_POKES = 100;

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

// Antes desse trabalho eu não sabia o nome dos tipos de pokemon e meu codigo tava quebrando por isso
const typeNames = {
    normal: "Normal",
    grass: "Grama",
    fire: "Fogo",
    water: "Água",
    bug: "Bixo (Bug)",
    electric: "Eletrico",
    rock: "Rocha",
    ghost: "Fantasma",
    poison: "Venenoso? (Poison)",
    psychic: "Psíquico",
    fighting: "Lutador",
    ground: "Terra? (Ground)",
    dragon: "Dragão",
};

// Mapa inverso: texto do botão -> chave do tipo (usado no filtro)
const labelToType = Object.fromEntries(
    Object.entries(typeNames).map(([key, label]) => [label, key])
);

let allPokes = [];
let filtroAtivo = null;

// elementos importantes
const nav = document.querySelector("nav");
const acharPoke = document.querySelector(".search-input");
const sort = document.querySelector(".select-filter select");
const clickTypes = document.querySelectorAll(".click-type");
const closeBtn = document.querySelector(".header-modal p");
closeBtn.addEventListener("click", fecharModal);

// quando nn é usado asynch function devemos utilizar .then() para dizer q tem q esperar a internet carregar os dados
function fetchPokemonsLista(qtd) {
    return fetch(`${API}?limit=${qtd}`) // ${} coloca var na string
        .then(res => {
            if (!res.ok) {
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
        <img src="https://media.tenor.com/fSsxftCb8w0AAAAj/pikachu-running.gif"
             style="grid-column: 1/-1; margin: 0 auto; display:block; width:55px;"
             alt="Carregando...">

        <p style="grid-column: 1/-1; text-align:center; color:black; font-family:Minecraft;">
            Carregando pokémons...
        </p>
    `;

    try {

        const lista = await fetchPokemonsLista(TOTAL_POKES);

        const details = await Promise.all( // array de promises dispara instantaneamente
            lista.map((p) => fetchPokeDetalhar(p.url))
        );

        allPokes = details;

        renderPokemons(allPokes);

    } catch (error) {

        nav.innerHTML = `
            <img src="https://tenor.com/pt-BR/view/pikachu-pokemon-pfff-walk-gif-3231170403271482048.gif"a
                 style="grid-column: 1/-1; margin: 0 auto; display:block; width:55px;"
                 alt="Error404...">

            <p style="grid-column: 1/-1; text-align:center; color:red; font-family:Minecraft;">
                Erro ao carregar pokémons.
            </p>
        `;

        console.error(error);
    }
}

// primeira letra fica maiuscula
function maiusculo(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function criarInstancia(pokemon) {
    const card = document.createElement("div");
    card.className = "pokemon-instance";
    card.style.gap = "5%";

    const box = document.createElement("div");
    box.className = "pokemon-box";

    const img = document.createElement("img");
    //   img.src = pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default || "images/exemple.png" || pokemon.sprites?.front_shiny;
    //   img.src = pokemon.sprites?.other?.showdown?.front_default || "images/exemple.png" || pokemon.sprites?.front_shiny;
    img.src = pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_shiny || "images/exemple.png" || pokemon.sprites?.front_shiny;
    img.alt = `${pokemon.name}.png`;

    const meta = document.createElement("div");
    meta.className = "pokemon-meta";

    const idSpan = document.createElement("span");
    idSpan.className = "pokemon-id";
    idSpan.textContent = `#${String(pokemon.id).padStart(4, "0")}`;

    const expSpan = document.createElement("span");
    expSpan.className = "pokemon-exp";
    expSpan.textContent = `EXP: ${pokemon.base_experience ?? "?"}`;

    meta.append(idSpan, expSpan);
    box.append(img, meta);

    const name = document.createElement("p");
    name.className = "pokemon-name";
    name.textContent = maiusculo(pokemon.name);

    card.append(box, name);

    pokemon.types.forEach(({ type }) => {
        const typeBox = document.createElement("div");
        typeBox.className = "tipo-pokemon-box";
        typeBox.style.backgroundColor = tiposCor[type.name] || "red";
        typeBox.style.color = "white";

        const p = document.createElement("p");
        p.textContent = typeNames[type.name] || maiusculo(type.name);

        typeBox.appendChild(p);
        card.appendChild(typeBox);
    });

    card.addEventListener("click", () => {
        console.log(`Card clicado: ${pokemon.name} (#${pokemon.id})`);
        abrirModal(pokemon); // passa o objeto inteiro, não só o nome  });
    });
    return card;
}

function renderPokemons(list) {
    nav.innerHTML = "";
    if (list.length === 0) {
        nav.innerHTML = "<p style='grid-column: 1/-1; text-align:center; color:white;'>Nenhum pokémon encontrado.</p>";
        return;
    }
    const fragment = document.createDocumentFragment();
    list.forEach((p) => fragment.appendChild(criarInstancia(p)));
    nav.appendChild(fragment);
}

function fecharModal() {
    document.body.classList.remove('lock-scroll');
    const dialog = document.querySelector("dialog");
    dialog.style.display = "none";
}

function abrirModal(pokemon) {
    document.body.classList.add('lock-scroll');
    const dialog = document.querySelector("dialog");
    dialog.style.display = "flex";

    const img = document.getElementById("imagem-detail");
    img.src = pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_shiny || "images/exemple.png" || pokemon.sprites?.front_shiny;
    img.alt = pokemon.name;

    const name = document.getElementById("poke-detail-name");
    name.textContent = maiusculo(pokemon.name);

    const kgs = document.getElementById("kg");
    kgs.textContent = pokemon.weight + " kg";

    const altura = document.getElementById("altura");
    altura.textContent = pokemon.height + " m";

    const ataqueDiv = document.getElementById("ataque-div");
    ataqueDiv.querySelectorAll("p.ataque-nome").forEach(p => p.remove());

    pokemon.abilities.forEach(({ ability }) => {
        const p = document.createElement("p");
        p.className = "ataque-nome";
        p.textContent = maiusculo(ability.name);
        ataqueDiv.appendChild(p);
    });

}

loadAllPokemons();
