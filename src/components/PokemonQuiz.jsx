import { useEffect, useState } from 'react';
import { getRandomPokemon, POKEMON_LIMITS } from '../services/pokemonService.js';
import PokemonStats from './PokemonStats.jsx';

const difficultyOptions = [
  { label: 'Easy', value: 'easy', limit: POKEMON_LIMITS.easy },
  { label: 'Medium', value: 'medium', limit: POKEMON_LIMITS.medium },
  { label: 'Hard', value: 'hard', limit: POKEMON_LIMITS.hard }
];

const generationRanges = [
  { label: 'Generation I', maxId: 151 },
  { label: 'Generation II', maxId: 251 },
  { label: 'Generation III', maxId: 386 },
  { label: 'Generation IV', maxId: 493 },
  { label: 'Generation V', maxId: 649 },
  { label: 'Generation VI', maxId: 721 },
  { label: 'Generation VII', maxId: 809 },
  { label: 'Generation VIII', maxId: 905 },
  { label: 'Generation IX', maxId: 1025 }
];

const getGeneration = (pokemonId) => {
  return generationRanges.find((generation) => pokemonId <= generation.maxId)?.label;
};

const PokemonQuiz = () => {
  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [difficulty, setDifficulty] = useState(difficultyOptions[2]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const hints = pokemon
    ? [
        `Starts with "${pokemon.name.charAt(0).toUpperCase()}"`,
        `Type: ${pokemon.types.join(', ')}`,
        `Generation: ${getGeneration(pokemon.id)}`
      ]
    : [];

  const loadPokemon = async (selectedDifficulty = difficulty) => {
    setIsLoading(true);
    setError('');
    setGuess('');
    setMessage('');
    setHintsUsed(0);
    setIsRevealed(false);

    try {
      const nextPokemon = await getRandomPokemon(selectedDifficulty.limit);
      setPokemon(nextPokemon);
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  const handleDifficultyChange = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    loadPokemon(selectedDifficulty);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!pokemon) {
      return;
    }

    const cleanGuess = guess.trim().toLowerCase();

    if (!cleanGuess) {
      setMessage('Type a Pokemon name before submitting your guess.');
      return;
    }

    if (cleanGuess === pokemon.name.toLowerCase()) {
      setMessage('Correct! Great guess.');
      setHintsUsed(0);
      setIsRevealed(true);
    } else {
      setMessage('Not quite. Try again, or reveal the answer when you are ready.');
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setHintsUsed(0);
    setMessage(`It's ${pokemon.name}!`);
  };

  const handleHint = () => {
    setHintsUsed((currentHintsUsed) => Math.min(currentHintsUsed + 1, hints.length));
  };

  if (isLoading) {
    return (
      <section className="quiz-card">
        <p className="status-message">Loading a Pokemon...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="quiz-card">
        <h1>Who's That Pokémon?</h1>
        <p className="error-message">{error}</p>
        <button type="button" onClick={loadPokemon}>
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="quiz-card">
      <header>
        <p className="eyebrow">PokéAPI Quiz</p>
        <h1>Who's That Pokémon?</h1>
      </header>

      <div className="difficulty-panel" aria-label="Difficulty level">
        <span>Difficulty</span>
        <div className="difficulty-options">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={difficulty.value === option.value ? 'active' : ''}
              aria-pressed={difficulty.value === option.value}
              onClick={() => handleDifficultyChange(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="image-frame">
        <img
          className={isRevealed ? 'pokemon-image' : 'pokemon-image silhouette'}
          src={pokemon.image}
          alt={isRevealed ? pokemon.name : 'Mystery Pokemon silhouette'}
        />
        {isRevealed && <p className="revealed-name">{pokemon.name}</p>}
      </div>

      <form className="guess-form" onSubmit={handleSubmit}>
        <label htmlFor="guess">Your guess</label>
        <div className="guess-row">
          <input
            id="guess"
            type="text"
            value={guess}
            onChange={({ target }) => setGuess(target.value)}
            placeholder="Type a Pokemon name"
          />
          <button type="submit">Submit Guess</button>
        </div>
      </form>

      {message && <p className="status-message">{message}</p>}

      <div className="actions">
        <button
          type="button"
          className="hint-button"
          onClick={handleHint}
          disabled={isRevealed || hintsUsed === hints.length}
        >
          Hint
        </button>
        <button type="button" className="secondary-button" onClick={handleReveal}>
          Reveal Answer
        </button>
        <button type="button" onClick={loadPokemon}>
          Next Pokemon
        </button>
      </div>

      {!isRevealed && hintsUsed > 0 && (
        <section className="hint-panel" aria-label="Hints">
          <h2>Hints</h2>
          <ul>
            {hints.slice(0, hintsUsed).map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </section>
      )}

      {isRevealed && <PokemonStats pokemon={pokemon} />}
    </section>
  );
};

export default PokemonQuiz;
