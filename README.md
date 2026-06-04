# Who's That Pokémon?

A fun Pokémon guessing game built with React and the PokéAPI.

The player is shown a Pokémon silhouette and must guess its name before revealing the answer. Once revealed, the app displays the Pokémon's image and key stats.

---

## Demo

The application:

1. Loads a random Generation I Pokémon from PokéAPI.
2. Displays the Pokémon as a silhouette.
3. Allows the user to enter a guess.
4. Checks whether the guess is correct.
5. Reveals the Pokémon's name, image, types, and stats.
6. Lets the user load another random Pokémon and continue playing.

---

## Features

### Quiz Gameplay

- Random Generation I Pokémon generation
- Silhouette image display
- User guess input
- Case-insensitive answer checking
- Whitespace-tolerant answer checking
- Reveal answer functionality
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

---

## Tech Stack

### Frontend

- React
- JavaScript (ES6+)
- CSS
- Vite

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
│   └── pokemonService.js
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
http://localhost:5173
```

---

## How It Works

### 1. Fetch a Random Pokémon

A random Pokémon ID from 1 to 151 is generated and sent to the PokéAPI:

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

### 3. Validate User Guesses

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

### 4. Reveal Pokémon Details

When the player clicks **Reveal Answer**, the application displays:

- Pokémon name
- Official artwork
- Types
- Height
- Weight
- Base stats

---

## Future Improvements

Potential features to build next:

### Difficulty Levels

Easy:

- First-generation Pokémon only

Medium:

- First 500 Pokémon

Hard:

- Entire Pokédex

### Scoring System

Track:

- Correct answers
- Incorrect answers
- Accuracy percentage

### Lives System

Give players:

- 3 lives
- Game Over screen

### Hint System

Reveal:

- First letter
- Pokémon type
- Generation

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
