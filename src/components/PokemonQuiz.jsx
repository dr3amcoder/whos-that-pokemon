import { useEffect, useState } from 'react';
import { getPokemonChoices, getRandomPokemon, POKEMON_LIMITS } from '../services/pokemonService.js';
import PokemonStats from './PokemonStats.jsx';

const difficultyOptions = [
  { label: 'Easy', value: 'easy', limit: POKEMON_LIMITS.easy },
  { label: 'Medium', value: 'medium', limit: POKEMON_LIMITS.medium },
  { label: 'Hard', value: 'hard', limit: POKEMON_LIMITS.hard }
];

const modeDescriptions = {
  easy: 'Multiple choice only',
  medium: 'Type your guess with hints',
  hard: 'Type your guess with no help'
};

const STARTING_LIVES = 3;
const STARTING_SCORE = {
  correct: 0,
  incorrect: 0,
  skipped: 0
};

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

const getTypeClassName = (pokemon) => {
  return pokemon ? `type-${pokemon.types[0]}` : '';
};

const PokemonQuiz = () => {
  const [pokemon, setPokemon] = useState(null);
  const [answerChoices, setAnswerChoices] = useState([]);
  const [wrongChoices, setWrongChoices] = useState([]);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [difficulty, setDifficulty] = useState(difficultyOptions[2]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [score, setScore] = useState(STARTING_SCORE);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const hints = pokemon
    ? [
        `Starts with "${pokemon.name.charAt(0).toUpperCase()}"`,
        `Type: ${pokemon.types.join(', ')}`,
        `Generation: ${getGeneration(pokemon.id)}`
      ]
    : [];
  const totalScoredGuesses = score.correct + score.incorrect;
  const accuracy =
    totalScoredGuesses === 0 ? 0 : Math.round((score.correct / totalScoredGuesses) * 100);
  const isEasyMode = difficulty.value === 'easy';
  const isMediumMode = difficulty.value === 'medium';
  const isHardMode = difficulty.value === 'hard';

  const loadPokemon = async (selectedDifficulty = difficulty, shouldResetLives = false) => {
    setIsLoading(true);
    setError('');
    setGuess('');
    setAnswerChoices([]);
    setWrongChoices([]);
    setMessage('');
    setHintsUsed(0);
    setIsRevealed(false);
    setIsGameOver(false);

    if (shouldResetLives) {
      setLives(STARTING_LIVES);
    }

    try {
      const nextPokemon = await getRandomPokemon(selectedDifficulty.limit);
      const nextChoices =
        selectedDifficulty.value === 'easy'
          ? await getPokemonChoices(nextPokemon, selectedDifficulty.limit)
          : [];
      setPokemon(nextPokemon);
      setAnswerChoices(nextChoices);
    } catch (err) {
      setError(err.message);
      setPokemon(null);
      setAnswerChoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  const handleDifficultyChange = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    loadPokemon(selectedDifficulty, true);
  };

  const checkAnswer = (answer) => {
    if (!pokemon || isRevealed || isGameOver) {
      return;
    }

    const cleanGuess = answer.trim().toLowerCase();

    if (!cleanGuess) {
      setMessage('Type a Pokemon name before submitting your guess.');
      return;
    }

    if (cleanGuess === pokemon.name.toLowerCase()) {
      setMessage('Correct! Great guess.');
      setHintsUsed(0);
      setIsRevealed(true);
      setScore((currentScore) => ({
        ...currentScore,
        correct: currentScore.correct + 1
      }));
    } else {
      if (wrongChoices.includes(cleanGuess)) {
        setMessage('You already tried that answer. Try a different one.');
        return;
      }

      const nextLives = lives - 1;
      setLives(nextLives);
      setWrongChoices((currentWrongChoices) => [...currentWrongChoices, cleanGuess]);
      setScore((currentScore) => ({
        ...currentScore,
        incorrect: currentScore.incorrect + 1
      }));

      if (nextLives === 0) {
        setIsGameOver(true);
        setIsRevealed(true);
        setHintsUsed(0);
        setMessage(`Game over! It's ${pokemon.name}.`);
      } else {
        setMessage(`Not quite. You have ${nextLives} ${nextLives === 1 ? 'life' : 'lives'} left.`);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkAnswer(guess);
  };

  const handleChoiceClick = (choice) => {
    setGuess(choice);
    checkAnswer(choice);
  };

  const handleHint = () => {
    setHintsUsed((currentHintsUsed) => Math.min(currentHintsUsed + 1, hints.length));
  };

  const handleNextPokemon = () => {
    if (pokemon && !isRevealed && !isGameOver) {
      setScore((currentScore) => ({
        ...currentScore,
        skipped: currentScore.skipped + 1
      }));
    }

    loadPokemon();
  };

  const handleNewGame = () => {
    loadPokemon(difficulty, true);
  };

  const handleResetScore = () => {
    setScore(STARTING_SCORE);
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
        <button type="button" onClick={() => loadPokemon()}>
          Try Again
        </button>
      </section>
    );
  }

  const typeClassName = getTypeClassName(pokemon);

  return (
    <section className={`quiz-card ${isRevealed ? typeClassName : ''}`}>
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

      <p className="mode-description">{modeDescriptions[difficulty.value]}</p>

      <div className="lives-panel" aria-label="Lives remaining">
        <span>Lives</span>
        <strong>{lives}</strong>
      </div>

      <section className="score-panel" aria-label="Score">
        <div>
          <span>Correct</span>
          <strong>{score.correct}</strong>
        </div>
        <div>
          <span>Wrong</span>
          <strong>{score.incorrect}</strong>
        </div>
        <div>
          <span>Skipped</span>
          <strong>{score.skipped}</strong>
        </div>
        <div>
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
      </section>

      <div className={`image-frame ${isRevealed ? typeClassName : ''}`}>
        <img
          className={isRevealed ? 'pokemon-image' : 'pokemon-image silhouette'}
          src={pokemon.image}
          alt={isRevealed ? pokemon.name : 'Mystery Pokemon silhouette'}
        />
        {isRevealed && <p className="revealed-name">{pokemon.name}</p>}
      </div>

      {isEasyMode && (
        <section className="choices-panel" aria-label="Multiple choice answers">
          <span>Choose one</span>
          <div className="choice-options">
            {answerChoices.map((choice) => {
              const cleanChoice = choice.toLowerCase();
              const isWrongChoice = wrongChoices.includes(cleanChoice);

              return (
                <button
                  key={choice}
                  type="button"
                  className={isWrongChoice ? 'wrong-choice' : ''}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={isRevealed || isGameOver || isWrongChoice}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {(isMediumMode || isHardMode) && (
        <form className="guess-form" onSubmit={handleSubmit}>
          <label htmlFor="guess">Type your guess</label>
          <div className="guess-row">
            <input
              id="guess"
              type="text"
              value={guess}
              onChange={({ target }) => setGuess(target.value)}
              placeholder="Type a Pokemon name"
              disabled={isRevealed || isGameOver}
            />
            <button type="submit" disabled={isRevealed || isGameOver}>
              Submit Guess
            </button>
          </div>
        </form>
      )}

      {message && <p className="status-message">{message}</p>}

      <div className="actions">
        {isMediumMode && (
          <button
            type="button"
            className="hint-button"
            onClick={handleHint}
            disabled={isRevealed || isGameOver || hintsUsed === hints.length}
          >
            Hint
          </button>
        )}
        <button type="button" onClick={handleNextPokemon} disabled={isGameOver}>
          Next Pokemon
        </button>
        <button type="button" className="new-game-button" onClick={handleNewGame}>
          New Game
        </button>
        <button type="button" className="reset-score-button" onClick={handleResetScore}>
          Reset Score
        </button>
      </div>

      {isGameOver && (
        <section className="game-over-panel" aria-label="Game over">
          <h2>Game Over</h2>
          <p>You ran out of lives. Start a new game to try again.</p>
        </section>
      )}

      {isMediumMode && !isRevealed && hintsUsed > 0 && (
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
