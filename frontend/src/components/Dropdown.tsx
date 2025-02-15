import { useState, useEffect } from "react";
import { Sun, Moon, Globe, ChevronDown, Settings } from "lucide-react";
import clsx from "clsx"; // Helps with conditional class management

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

    return { darkMode, toggleDarkMode: () => setDarkMode(!darkMode) };
}

export default function Dropdown() {
    const { darkMode, toggleDarkMode } = DarkModeToggle();
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 bg-bglight hover:bg-gray-100 dark:bg-bgdark border-gray-400 dark:border-white border hover:dark:bg-accent rounded-lg duration-300 transition-transform"
            >
                <Settings
                    size={20}
                    className={clsx("transition-transform duration-300 dark:text-bglight", {
                        "rotate-[60deg]": isOpen,
                    })}
                />
                <ChevronDown
                    size={16}
                    className={clsx("transition-transform duration-300 dark:text-bglight", {
                        "rotate-[90deg]": isOpen,
                    })}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bglight dark:bg-bgdark border dark:border-gray-900 shadow-lg rounded-lg overflow-hidden">
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:text-textdark dark:hover:bg-accent"
                    >
                        {darkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>

                    <button
                        onClick={() => setLanguage(language === "en" ? "cz" : "en")}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:text-textdark dark:hover:bg-accent"
                    >
                        <Globe size={16} className="mr-2" />
                        {language === "en" ? "Čeština" : "English"}
                    </button>
                </div>
            )}
        </div>
    );
}
