const statLabels = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Special Attack',
  'special-defense': 'Special Defense',
  speed: 'Speed'
};

const MAX_STAT_VALUE = 255;

const PokemonStats = ({ pokemon }) => {
  return (
    <section className="answer-panel" aria-label="Pokemon answer">
      <h2>{pokemon.name}</h2>

      <div className="details-grid">
        <div>
          <span className="detail-label">Type</span>
          <div className="type-badges">
            {pokemon.types.map((type) => (
              <span key={type} className={`type-badge type-${type}`}>
                {type}
              </span>
            ))}
          </div>
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
            <div className="stat-header">
              <span>{statLabels[stat.name] || stat.name}</span>
              <strong>{stat.value}</strong>
            </div>
            <div className="stat-bar" aria-hidden="true">
              <span style={{ width: `${Math.min((stat.value / MAX_STAT_VALUE) * 100, 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PokemonStats;
