import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPokemonChoices, getRandomPokemon, POKEMON_LIMITS } from './pokemonService.js';

const pokemonApiResponse = {
  id: 25,
  name: 'pikachu',
  sprites: {
    front_default: 'fallback-image.png',
    other: {
      'official-artwork': {
        front_default: 'official-artwork.png'
      }
    }
  },
  types: [
    {
      type: {
        name: 'electric'
      }
    }
  ],
  height: 4,
  weight: 60,
  stats: [
    {
      base_stat: 35,
      stat: {
        name: 'hp'
      }
    },
    {
      base_stat: 55,
      stat: {
        name: 'attack'
      }
    }
  ]
};

describe('pokemonService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defines the available difficulty limits', () => {
    expect(POKEMON_LIMITS).toEqual({
      easy: 151,
      medium: 500,
      hard: 1025
    });
  });

  it('fetches a random Pokemon and formats the response for the app', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.24);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => pokemonApiResponse
    });

    const pokemon = await getRandomPokemon(100);

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
    expect(pokemon).toEqual({
      id: 25,
      name: 'pikachu',
      image: 'official-artwork.png',
      types: ['electric'],
      height: 4,
      weight: 60,
      stats: [
        {
          name: 'hp',
          value: 35
        },
        {
          name: 'attack',
          value: 55
        }
      ]
    });
  });

  it('uses the fallback sprite when official artwork is missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ...pokemonApiResponse,
        sprites: {
          ...pokemonApiResponse.sprites,
          other: {
            'official-artwork': {
              front_default: null
            }
          }
        }
      })
    });

    const pokemon = await getRandomPokemon();

    expect(pokemon.image).toBe('fallback-image.png');
  });

  it('creates shuffled multiple-choice answers with the correct Pokemon included', async () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.01)
      .mockReturnValueOnce(0.02)
      .mockReturnValueOnce(0.03)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const pokemonNames = {
      2: 'ivysaur',
      3: 'venusaur',
      4: 'charmander'
    };

    globalThis.fetch = vi.fn().mockImplementation((url) => {
      const pokemonId = Number(url.split('/').pop());

      return Promise.resolve({
        ok: true,
        json: async () => ({
          name: pokemonNames[pokemonId]
        })
      });
    });

    const choices = await getPokemonChoices({ id: 1, name: 'bulbasaur' }, 100);

    expect(choices).toHaveLength(4);
    expect(choices).toEqual(expect.arrayContaining(['bulbasaur', 'ivysaur', 'venusaur', 'charmander']));
  });

  it('throws a friendly error when the API request fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false
    });

    await expect(getRandomPokemon()).rejects.toThrow('Could not fetch a Pokemon. Please try again.');
  });
});
