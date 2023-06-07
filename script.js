const pokemonName = document.getElementById('pkmn_name');
const pokemonNumber = document.getElementById('pkmn_number');
const pokemonImage = document.getElementById('pkmn_img');

const form = document.getElementById('form');
const input = document.getElementById('input_search');

const buttonPrev = document.getElementById('btn_prev');
const buttonNext = document.getElementById('btn_next');

const pcBox = document.querySelector('.pc-box');
const typeBox = document.getElementById('type-box');

const pokeCount = 649;

window.onload = async () => {
    createPokemonCount()
}

const createPokemonCount = async () => {
    for (let i = 1; i <= pokeCount; i++) {
        const pokemonData = await fetchPokemon(i);
        createPokemonCard(pokemonData)
    }
}

const fetchPokemon = async (pokemonIdOrName) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIdOrName}`);

    if (APIResponse.status == 200) {
        const data = await APIResponse.json();
        return data;
    }
}

const setPokemonType = (pokemon) => {
    // Set pokemon types in display
    const typesToArray = pokemon.types.map((type) => `<span class="t-type type-${type.type.name} text-center">${type.type.name}</span>`);

    const typesToString = typesToArray.join('')

    typeBox.innerHTML = typesToString;
}

const createPokemonCard = (pokemonId) => {
    const card = document.createElement('div')
    card.className = 'col-6 col-lg-3 col-xl-2'

    const pokemonInnerHTML = `
        <button class="pokecard" id="${pokemonId.name}">
            <img class="pokemon" id="${pokemonId.id}"
                src="${pokemonId.sprites.versions['generation-v']['black-white'].animated.front_default}"
                alt="${pokemonId.name}">
            <img class="floor" src="img/chão-selecionado.png">
        </button>
    `
    card.innerHTML = pokemonInnerHTML
    pcBox.appendChild(card)

    const button = document.getElementById(pokemonId.name);
    const pokeImg = document.getElementById(pokemonId.id);

    button.addEventListener('click', () => {
        pokemonImage.classList.add('pkmn_animation_delay')
        pokeImg.classList.add('pokemon-fallign')

        pokemonNumber.innerHTML = `# ${pokemonId.id}`;
        pokemonName.innerHTML = pokemonId.name;
        pokemonImage.src = pokemonId.sprites.versions['generation-v']['black-white'].animated.front_default
        setPokemonType(pokemonId);
        searchPokemon = pokemonId.id;
    })

    if (pokemonImage) {
        pokemonImage.addEventListener('animationend', (event) => {
            if (event.animationName == 'falling-pkmn-img') {
                pokemonImage.classList.remove('pkmn_animation')
            } else if (event.animationName == 'falling-pkmn-img_delay') {
                pokemonImage.classList.remove('pkmn_animation_delay')
                pokeImg.classList.remove('pokemon-fallign')
            }
        })
    }
}

const notFoundDisplayPokemon = () => {
    pokemonImage.style.display = 'block'
    typeBox.innerHTML = '';
    pokemonName.innerHTML = 'Not Found';
    pokemonNumber.innerHTML = '';
    input.value = '';
    pokemonImage.src = 'img/user-sad.svg';
    pokemonImage.classList.add('pkmn_animation')
    searchPokemon = 0;
}

let searchPokemon = 1;

const renderPokemonInDisplay = async (pokemonId) => {
    typeBox.innerHTML = '';
    pokemonName.innerHTML = 'loading...';
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none'
    typeBox.innerHTML = '';

    const pokemonData = await fetchPokemon(pokemonId);

    if (!pokemonData || pokemonData.id >= 650) {
        notFoundDisplayPokemon();
        return
    };

    pokemonImage.style.display = 'block'
    pokemonName.innerHTML = pokemonData.name;
    pokemonNumber.innerHTML = '# ' + pokemonData.id;
    pokemonImage.src = pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default;
    input.value = '';
    searchPokemon = pokemonData.id;
    setPokemonType(pokemonData);

    const modal = document.getElementById('default-modal')
    const openModal = async (button) => {

        const action = button.target.id;

        if (action == 'about-button') {
            const contentInnerHTML = `
        <div class="header-modal d-flex align-items-center justify-content-between">
        <h2>About</h2>
        <button id="modalClose" class="btn">x</button>
        </div>
        <div class="body-modal">
        <div>
        <p>Height: ${pokemonData.height}ft</p>
        <p>Weight: ${pokemonData.weight}lbs</p>
        </div>
        </div>
        `
            modal.innerHTML = contentInnerHTML
            modal.classList.add('active')
        } else {
            const contentInnerHTML = `
        <div class="header-modal d-flex align-items-center justify-content-between">
        <h2>Stats Base</h2>
        <button id="modalClose" class="btn">x</button>
        </div>
        <div class="body-modal">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur erat diam, viverra eget tortor sed, dictum interdum lorem.</p>
        </div>
        `
            modal.innerHTML = contentInnerHTML
            modal.classList.add('active')
        }

        document.getElementById('modalClose').addEventListener('click', closeModal)
    }
    const closeModal = () => document.getElementById('default-modal').classList.remove('active')
    document.getElementById('about-button').addEventListener('click', openModal)
    document.getElementById('stats-button').addEventListener('click', openModal)
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (input.value == '' || input.value >= 650) {
        notFoundDisplayPokemon();
        return
    }

    renderPokemonInDisplay(input.value.toLowerCase().trim());
});

function prevPokemon() {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        pokemonImage.classList.add('pkmn_animation')
        renderPokemonInDisplay(searchPokemon);
    }

};

function nextPokemon() {
    if (searchPokemon < 649) {
        searchPokemon += 1;
        pokemonImage.classList.add('pkmn_animation')
        renderPokemonInDisplay(searchPokemon);
    }
};

renderPokemonInDisplay(searchPokemon);