import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div
      className="theme-switch"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <label className="switch" aria-label="Toggle dark mode">
        <input
          id="mock-test-dark-mode"
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
        <div className="slider round">
          <div className="sun-moon">
            {["moon-dot-1", "moon-dot-2", "moon-dot-3", "light-ray-1", "light-ray-2", "light-ray-3"].map((id) => (
              <svg
                key={id}
                id={`mock-${id}`}
                className={id.startsWith("moon") ? "moon-dot" : "light-ray"}
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="50" />
              </svg>
            ))}
            {[1, 2, 3].map((id) => (
              <svg
                key={`dark-cloud-${id}`}
                id={`mock-cloud-${id}`}
                className="cloud-dark"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="50" />
              </svg>
            ))}
            {[4, 5, 6].map((id) => (
              <svg
                key={`light-cloud-${id}`}
                id={`mock-cloud-${id}`}
                className="cloud-light"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="50" />
              </svg>
            ))}
          </div>
          <div className="stars">
            {[1, 2, 3, 4].map((star) => (
              <svg
                key={star}
                id={`mock-star-${star}`}
                className="star"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
              </svg>
            ))}
          </div>
        </div>
      </label>
    </div>
  );
}

export default ThemeToggle;
