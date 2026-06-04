import { useEffect, useState } from 'react';
import { getRandomPokemon } from '../services/pokemonService.js';
import PokemonStats from './PokemonStats.jsx';

const PokemonQuiz = () => {
  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPokemon = async () => {
    setIsLoading(true);
    setError('');
    setGuess('');
    setMessage('');
    setIsRevealed(false);

    try {
      const nextPokemon = await getRandomPokemon();
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
