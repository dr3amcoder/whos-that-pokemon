const API_URL = 'https://pokeapi.co/api/v2/pokemon';

export const POKEMON_LIMITS = {
  easy: 151,
  medium: 500,
  hard: 1025
};

export const getRandomPokemon = async (maxPokemonId = POKEMON_LIMITS.hard) => {
  const randomId = Math.floor(Math.random() * maxPokemonId) + 1;
  const response = await fetch(`${API_URL}/${randomId}`);

  if (!response.ok) {
    throw new Error('Could not fetch a Pokemon. Please try again.');
  }

  const data = await response.json();

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
