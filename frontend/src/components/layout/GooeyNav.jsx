import { useEffect, useRef, useState } from "react";

function GooeyNav({ items, initialActiveIndex = 0, animationTime = 600, colors = [1, 2, 3, 1, 2, 3] }) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [particles, setParticles] = useState([]);
  const navRef = useRef(null);

  useEffect(() => {
    const active = navRef.current?.querySelector("[data-active='true']");
    if (!active) return;

    const rect = active.getBoundingClientRect();
    const parentRect = navRef.current.getBoundingClientRect();
    const x = rect.left - parentRect.left + rect.width / 2;
    const y = rect.top - parentRect.top + rect.height / 2;

    const nextParticles = Array.from({ length: 15 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 15;
      const distance = 8 + Math.random() * 18;
      return {
        id: `${activeIndex}-${index}-${Date.now()}`,
        x,
        y,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        scale: 0.55 + Math.random() * 0.6,
        color: colors[index % colors.length],
      };
    });

    setParticles(nextParticles);
    const timeout = window.setTimeout(() => setParticles([]), animationTime);
    return () => window.clearTimeout(timeout);
  }, [activeIndex, animationTime, colors]);

  return (
    <div ref={navRef} className="gooey-nav relative flex items-center">
      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        {items.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            data-active={index === activeIndex}
            onClick={(event) => {
              if (item.href === "#") event.preventDefault();
              setActiveIndex(index);
            }}
            className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              index === activeIndex
                ? "bg-[#1687a7] text-white shadow-md"
                : "text-[#276678] hover:bg-[#d3e0ea] dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>

      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`pointer-events-none absolute z-0 h-1.5 w-1.5 rounded-full gooey-particle gooey-color-${particle.color}`}
          style={{
            left: particle.x,
            top: particle.y,
            "--dx": `${particle.dx}px`,
            "--dy": `${particle.dy}px`,
            "--scale": particle.scale,
            animationDuration: `${animationTime}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default GooeyNav;
