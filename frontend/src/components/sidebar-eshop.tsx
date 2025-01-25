import { useState } from "react";

const Sidebar = () => {
    const categories = [
        {
            name: "Motorové díly",
            subcategories: ["Brzdové kotouče", "Spojky", "Turbodmychadla", "Výfukové systémy"],
        },
        {
            name: "Silikonové hadice a hadicové spony",
            subcategories: ["T-kus silikonové hadice", "Redukce", "Hadicové objímky"],
        },
        {
            name: "Softwarové úpravy",
            subcategories: ["Chiptuning", "EGR vypnutí", "DPF řešení", "Start-Stop deaktivace"],
        },
        {
            name: "Dieselservis",
            subcategories: ["Diagnostika", "Čištění vstřikovačů", "Palivová čerpadla"],
        },
        {
            name: "Autokosmetika a chemie",
            subcategories: ["Čističe interiéru", "Leštěnky", "Šampony na auto"],
        },
        {
            name: "Oleje a aditiva",
            subcategories: ["Motorové oleje", "Aditiva nafta/benzín", "Převodové oleje"],
        },
        {
            name: "Boutique / Doplňky",
            subcategories: ["Trička", "Kšiltovky", "Samolepky"],
        },
        {
            name: "Povinná a doporučená výbava",
            subcategories: ["Lékárničky", "Výstražné trojúhelníky", "Tažné lana"],
        },
        {
            name: "Servisní balíčky",
            subcategories: ["Sady na výměnu oleje", "Sady na výměnu filtrů"],
        },
        {
            name: "Brzdový systém",
            subcategories: ["Brzdové destičky", "Brzdové kapaliny", "Sady brzd"],
        },
    ];

    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

    return (
        <aside className="bg-white dark:bg-gray-800 w-64 p-4 shadow-lg rounded-lg">
            <nav>
                <ul className="space-y-2">
                    {categories.map((category, index) => (
                        <li
                            key={index}
                            className="relative group"
                            onMouseEnter={() => setHoveredCategory(index)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            <div
                                className={`block p-3 rounded-lg bg-white dark:bg-gray-700 shadow-md text-gray-800 dark:text-white transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 ${hoveredCategory === index ? "bg-gray-200 dark:bg-gray-600" : ""
                                    }`}
                            >
                                {category.name}
                            </div>
                            {hoveredCategory === index && (
                                <ul
                                    className="absolute left-full top-0 max-w-[calc(100vw-16rem)] bg-white dark:bg-gray-700 shadow-lg p-4 space-y-2 rounded-lg z-50"
                                    style={{ width: "max(200px, 16rem)" }}
                                >
                                    {category.subcategories.map((subcategory, subIndex) => (
                                        <li key={subIndex}>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                            >
                                                {subcategory}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
