const statLabels = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Special Attack',
  'special-defense': 'Special Defense',
  speed: 'Speed'
};

function PokemonStats({ pokemon }) {
  return (
    <section className="answer-panel" aria-label="Pokemon answer">
      <h2>{pokemon.name}</h2>

      <div className="details-grid">
        <div>
          <span className="detail-label">Type</span>
          <p>{pokemon.types.join(', ')}</p>
        </div>
        <div>
          <span className="detail-label">Height</span>
          <p>{pokemon.height}</p>
        </div>
        <div>
          <span className="detail-label">Weight</span>
          <p>{pokemon.weight}</p>
        </div>
      </div>

      <h3>Base Stats</h3>
      <ul className="stats-list">
        {pokemon.stats.map((stat) => (
          <li key={stat.name}>
            <span>{statLabels[stat.name] || stat.name}</span>
            <strong>{stat.value}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PokemonStats;
