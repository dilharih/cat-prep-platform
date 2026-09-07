const SHARDS = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 23) % 101}%`,
  top: `${(index * 37) % 103}%`,
  width: `${24 + ((index * 11) % 70)}px`,
  height: `${2 + ((index * 5) % 4)}px`,
  rotate: `${-48 + ((index * 29) % 96)}deg`,
  delay: `${-((index * 0.37) % 7)}s`,
  duration: `${5.5 + ((index * 0.43) % 4)}s`,
  opacity: `${0.14 + ((index * 7) % 28) / 100}`,
}));

export default function AeroShards({ className = '' }) {
  return (
    <div className={`aero-shards ${className}`} aria-hidden="true">
      <div className="aero-shards__glow aero-shards__glow--one" />
      <div className="aero-shards__glow aero-shards__glow--two" />

      <div className="aero-shards__field">
        {SHARDS.map((shard, index) => (
          <span
            key={index}
            className="aero-shards__shard"
            style={{
              left: shard.left,
              top: shard.top,
              width: shard.width,
              height: shard.height,
              '--shard-rotate': shard.rotate,
              '--shard-delay': shard.delay,
              '--shard-duration': shard.duration,
              '--shard-opacity': shard.opacity,
            }}
          />
        ))}
      </div>

      <div className="aero-shards__sweep" />
    </div>
  );
}
