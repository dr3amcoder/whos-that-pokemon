const API_URL = 'https://pokeapi.co/api/v2/pokemon';

export const POKEMON_LIMITS = {
  easy: 151,
  medium: 500,
  hard: 1025
};

const getRandomPokemonId = (maxPokemonId) => {
  return Math.floor(Math.random() * maxPokemonId) + 1;
};

const formatPokemon = (data) => {
  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other['official-artwork'].front_default ||
      data.sprites.front_default,
    types: data.types.map((item) => item.type.name),
    height: data.height,
    weight: data.weight,
    stats: data.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat
    }))
  };
};

const fetchPokemonById = async (pokemonId) => {
  const response = await fetch(`${API_URL}/${pokemonId}`);

  if (!response.ok) {
    throw new Error('Could not fetch a Pokemon. Please try again.');
  }

  return response.json();
};

const shuffleChoices = (choices) => {
  const shuffledChoices = [...choices];

  for (let index = shuffledChoices.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledChoices[index], shuffledChoices[randomIndex]] = [
      shuffledChoices[randomIndex],
      shuffledChoices[index]
    ];
  }

  return shuffledChoices;
};

export const getRandomPokemon = async (maxPokemonId = POKEMON_LIMITS.hard) => {
  const randomId = getRandomPokemonId(maxPokemonId);
  const data = await fetchPokemonById(randomId);

  return formatPokemon(data);
};

export const getPokemonChoices = async (
  correctPokemon,
  maxPokemonId = POKEMON_LIMITS.hard,
  totalChoices = 4
) => {
  const choiceCount = Math.min(totalChoices, maxPokemonId);
  const choices = new Set([correctPokemon.name]);

  while (choices.size < choiceCount) {
    const randomId = getRandomPokemonId(maxPokemonId);

    if (randomId !== correctPokemon.id) {
      const pokemon = await fetchPokemonById(randomId);
      choices.add(pokemon.name);
    }
  }

  return shuffleChoices([...choices]);
};
