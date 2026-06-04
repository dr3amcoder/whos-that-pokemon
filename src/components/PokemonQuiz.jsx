import { useEffect, useState } from 'react';
import { getRandomPokemon, POKEMON_LIMITS } from '../services/pokemonService.js';
import PokemonStats from './PokemonStats.jsx';

const difficultyOptions = [
  { label: 'Easy', value: 'easy', limit: POKEMON_LIMITS.easy },
  { label: 'Medium', value: 'medium', limit: POKEMON_LIMITS.medium },
  { label: 'Hard', value: 'hard', limit: POKEMON_LIMITS.hard }
];

const PokemonQuiz = () => {
  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [difficulty, setDifficulty] = useState(difficultyOptions[2]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPokemon = async (selectedDifficulty = difficulty) => {
    setIsLoading(true);
    setError('');
    setGuess('');
    setMessage('');
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
    } else {
      setMessage('Not quite. Try again, or reveal the answer when you are ready.');
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setMessage(`It's ${pokemon.name}!`);
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
        <button type="button" className="secondary-button" onClick={handleReveal}>
          Reveal Answer
        </button>
        <button type="button" onClick={loadPokemon}>
          Next Pokemon
        </button>
      </div>

      {isRevealed && <PokemonStats pokemon={pokemon} />}
    </section>
  );
};

export default PokemonQuiz;
