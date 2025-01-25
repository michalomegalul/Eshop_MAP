import { useState, useEffect } from "react";

function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="fixed top-4 right-4 p-2 bg-bgdark rounded-full shadow-md dark:bg-bglight transition duration-300 ease-in-out"
        >
            {darkMode ? (
                <span className="text-yellow-400 text-lg">☀️</span>
            ) : (
                <span className="text-gray-600 text-lg">🌙</span>
            )}
        </button>
    );
}

export default DarkModeToggle;
