# Who's That Pokémon?

A fun Pokémon guessing game built with React and the PokéAPI.

The player is shown a Pokémon silhouette and must guess its name before revealing the answer. Once revealed, the app displays the Pokémon's image and key stats.

Live app:
https://dr3amcoder.github.io/whos-that-pokemon/

---

## Demo

The application:

1. Loads a random main-series Pokémon from PokéAPI.
2. Displays the Pokémon as a silhouette.
3. Changes the available controls based on the selected difficulty.
4. Shows multiple-choice answers in Easy mode.
5. Checks whether the selected or typed guess is correct.
6. Reveals the Pokémon's name, image, types, and stats after a correct guess or Game Over.
7. Lets the user load another random Pokémon and continue playing.

---

## Features

### Quiz Gameplay

- Random main-series Pokémon generation
- Difficulty levels:
  - Easy: first 151 Pokémon, multiple choice only
  - Medium: first 500 Pokémon, typed guess with hints
  - Hard: first 1025 Pokémon, typed guess with no hints or reveal shortcut
- Silhouette image display
- Four multiple-choice answer buttons in Easy mode
- User guess input in Medium and Hard modes
- Case-insensitive answer checking
- Whitespace-tolerant answer checking
- Wrong multiple-choice answers are disabled after being tried
- Progressive hint system in Medium mode:
  - First letter
  - Pokémon type
  - Generation
- Correct guesses reveal the Pokémon immediately
- Lives system:
  - 3 lives per game
  - Wrong guesses remove 1 life
  - Game Over screen at 0 lives
- Scoring system:
  - Correct guesses
  - Wrong guesses
  - Skipped rounds
  - Accuracy percentage
- Next Pokémon functionality

### Pokémon Information

- Name
- Official artwork
- Type(s)
- Height
- Weight
- Base stats:
  - HP
  - Attack
  - Defense
  - Special Attack
  - Special Defense
  - Speed

### User Experience

- Loading state while fetching data
- Error handling for failed API requests
- Responsive layout
- Clean and simple interface
- Pokémon-inspired theme colours
- Type-based colour accents
- Type badges and stat bars

---

## Tech Stack

### Frontend

- React
- JavaScript (ES6+)
- CSS
- Vite
- Vitest

### API

- PokéAPI

Website:
https://pokeapi.co

Documentation:
https://pokeapi.co/docs/v2

---

## Project Structure

```text
src/
├── components/
│   ├── PokemonQuiz.jsx
│   └── PokemonStats.jsx
│
├── services/
│   ├── pokemonService.js
│   └── pokemonService.test.js
│
├── App.jsx
├── App.css
└── main.jsx
```

---

## Installation

### Clone the repository

```bash
git clone git@github.com:dr3amcoder/whos-that-pokemon.git
```

Or with HTTPS:

```bash
git clone https://github.com/dr3amcoder/whos-that-pokemon.git
```

### Navigate into the project

```bash
cd whos-that-pokemon
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173/whos-that-pokemon/
```

### Run tests

```bash
npm test
```

---

## How It Works

### 1. Fetch a Random Pokémon

A random Pokémon ID is generated based on the selected difficulty level:

- Easy: 1 to 151
- Medium: 1 to 500
- Hard: 1 to 1025

The selected ID is sent to the PokéAPI:

```javascript
https://pokeapi.co/api/v2/pokemon/{id}
```

Example:

```javascript
https://pokeapi.co/api/v2/pokemon/25
```

This returns Pokémon information including:

- Name
- Types
- Stats
- Height
- Weight
- Images

---

### 2. Create the Silhouette

Before the answer is revealed, the Pokémon image is hidden using a CSS filter:

```css
.silhouette {
  filter: brightness(0);
}
```

Once revealed, the filter is removed.

---

### 3. Generate Multiple Choices

In Easy mode, after the random Pokémon is loaded, the app fetches three additional random Pokémon names from the same difficulty range.

The choices include:

- The correct Pokémon name
- Three incorrect Pokémon names

The answers are shuffled before they are displayed. Selecting a choice checks the answer immediately, which makes the game easier for younger players.

Multiple-choice answers are hidden in Medium and Hard modes.

---

### 4. Validate User Guesses

The app compares:

```javascript
guess.trim().toLowerCase()
```

against:

```javascript
pokemon.name.toLowerCase()
```

This ensures answers are:

- Case insensitive
- Whitespace tolerant

---

### 5. Reveal Pokémon Details

When the player guesses correctly or runs out of lives, the application displays:

- Pokémon name
- Official artwork
- Types
- Height
- Weight
- Base stats

---

### 6. Use Hints

In Medium mode, the player can reveal up to three hints before revealing the answer:

- First letter
- Pokémon type
- Generation

Hints reset when the player moves to the next Pokémon or changes difficulty.
Hints are hidden once the Pokémon has been revealed.

Hints are not available in Easy or Hard mode.

---

### 7. Manage Lives

The player starts each game with 3 lives. Each incorrect guess removes 1 life.

When the player reaches 0 lives:

- The Pokémon is revealed
- The Game Over screen is shown
- Guessing and hints are disabled

The player can start over with **New Game**.

---

### 8. Track Score

The score panel tracks:

- Correct guesses
- Wrong guesses
- Skipped rounds
- Accuracy percentage

Accuracy is calculated from correct and wrong guesses. Skipped rounds are tracked separately and do not reduce accuracy.

The player can move to another Pokémon with **Next Pokemon**. If the current Pokémon has not been answered yet, this counts as a skipped round.

The player can clear the scoreboard with **Reset Score**.

---

## Styling

The interface uses a modern Pokémon-inspired colour palette:

- Bright blue for primary actions and section accents
- Warm yellow for hints, lives, and friendly feedback
- Controlled red for important moments
- Deep navy for readable text and contrast
- Soft mist backgrounds to keep the app easy on the eyes

The Pokémon type colours are used only for type badges and the revealed Pokémon accent, so the overall interface stays consistent while still feeling connected to each Pokémon.

---

## Testing

The project includes simple Vitest tests for the PokéAPI service.

Current tests check that:

- Difficulty limits are defined correctly
- A random Pokémon request is made with the expected ID
- Multiple-choice answers include the correct Pokémon and random distractors
- API data is transformed into the shape used by the app
- A fallback sprite is used when official artwork is unavailable
- Failed API requests throw a friendly error message

Run the tests with:

```bash
npm test
```

---

## Future Improvements

Potential features to build next:

### Timer Mode

Challenge players to guess before time runs out.

### Leaderboard

Store high scores using:

- Local Storage
- Backend API
- Database

### Pokémon Generations Filter

Allow players to choose:

- Generation I
- Generation II
- Generation III
- etc.

---

## Learning Goals

This project is useful for practicing:

### React

- Components
- Props
- State
- Hooks
- Conditional rendering

### API Integration

- Fetch requests
- Async/await
- Error handling

### JavaScript

- Arrays
- Objects
- String manipulation
- Data transformation

### Frontend Development

- Responsive design
- User interaction
- Form handling
- Component architecture

---

## Credits

### PokéAPI

Data provided by:

https://pokeapi.co

Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, and The Pokémon Company.

This project is intended for educational and portfolio purposes only.

---

## License

MIT License

Feel free to use, modify, and learn from this project.
