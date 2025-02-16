import { useEffect, useState } from "react";
import { Mail, Facebook, Instagram, Phone, X } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleThemeChange = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, { attributes: true });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <footer className="w-[90%] rounded-xl mx-auto flex flex-col justify-center px-6 sm:px-10 md:px-16 2xl:px-24 py-8 lg:py-10 mt-36 bg-[#f5e9e9] dark:bg-[#2C2B2B] text-textlight dark:text-textdark">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-12">
                    {/* Left - Logo & Contacts */}
                    <div className="flex flex-col items-center md:items-start gap-8 text-nowrap">
                        <img className="w-72 sm:w-80 cursor-pointer" src={isDarkMode ? "files/DP-logo-white.png" : "files/DP-logo.png"} alt="DieselPower Logo" />
                        <div className="flex flex-col gap-4 text-center md:text-left">
                            <a href="mailto:form@dp-race.com" className="flex items-center gap-3 p-3 border rounded-md w-fit mx-auto md:mx-0 hover:bg-[#1E88E5] hover:text-textdark transition-all duration-200">
                                <Mail size={18} />
                                form@dp-race.com
                            </a>
                            <a href="https://www.facebook.com/dieselpower.cz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border rounded-md w-fit mx-auto md:mx-0 hover:bg-[#4267B2] hover:text-textdark transition-all duration-200">
                                <Facebook size={18} />
                                DIESELPOWER s.r.o.
                            </a>
                            <a href="https://www.instagram.com/dieselpower_cz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border rounded-md w-fit mx-auto md:mx-0 hover:bg-[#E1306C] hover:text-textdark transition-all duration-200">
                                <Instagram size={18} />
                                dieselpower_cz
                            </a>
                            <a href="tel:+420724379112" className="flex items-center gap-3 p-3 border rounded-md w-fit mx-auto md:mx-0 hover:bg-[#1E88E5] hover:text-textdark transition-all duration-200">
                                <Phone size={18} />
                                +420 724 379 112
                            </a>
                        </div>
                    </div>

                    {/* Fakturační údaje */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-xl">Fakturační údaje</h3>
                        <div className="mt-2 space-y-1 text-sm">
                            <p>DIESELPOWER s.r.o.</p>
                            <p>Čimická 717/34, Kobylisy</p>
                            <p>182 00 Praha 8, Česká Republika</p>
                            <p>IČ: 27322572</p>
                            <p>DIČ: CZ27322572</p>
                            <p>Společnost je zapsaná v OR</p>
                            <p>vedená u Městského soudu v Praze</p>
                            <p>pod složkou C 216502</p>
                        </div>
                    </div>

                    {/* Bankovní spojení a Mezinárodní platby */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-xl">Bankovní spojení</h3>
                        <div className="mt-2 space-y-1 text-sm">
                            <p>Účet: 2670917001/5500</p>
                            <p>Raiffeisenbank a.s.</p>
                            <p>Olbrachtova 9, 14021 Praha 4</p>
                        </div>

                        <h3 className="mt-4 font-semibold text-xl">Mezinárodní platby</h3>
                        <div className="mt-2 space-y-1 text-sm">
                            <p>IBAN: CZ952060000000001094192</p>
                            <p>SWIFT: CITFCZPPXXX</p>
                            <p>Citiﬁn, Avenir Business Park</p>
                            <p>Radlická 751/113e, 158 00 Praha 5 – Jinonice</p>
                        </div>
                    </div>

                    {/* Kontaktní informace */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-xl">Kontaktní informace</h3>
                        <div className="mt-2 space-y-3 text-sm">
                            <p className="font-semibold">Oddělení úprav motorů:</p>
                            <div className="pl-4 space-y-1">
                                <p>ČVUT Praha - laboratoře fakulty strojní</p>
                                <p>Pod Juliskou 4</p>
                                <p>16000 Praha Česká republika</p>
                            </div>
                            <p className="font-semibold">Oddělení vývoje Emisních Systémů:</p>
                            <div className="pl-4 space-y-1">
                                <p>Vědeckotechnický park Roztoky</p>
                                <p>Přílepská 1920</p>
                                <p>25263 Roztoky</p>
                            </div>
                        </div>
                    </div>

                    {/* Právní upozornění */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-xl">Právní upozornění</h3>
                        <p className="text-sm mt-2">
                            Uvedené značky automobilek, jsou ochrannými známkami jejich vlastníků...
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-100 hover:dark:bg-bgdark transition-all duration-200"
                        >
                            Zobrazit více
                        </button>
                    </div>
                </div>

                <p className="border-t border-gray-400 pt-6 px-1 mt-8 text-center text-sm">
                    Copyright © {currentYear} DIESELPOWER s.r.o. | All Rights Reserved | Powered by Vite.js
                </p>
            </footer>

            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 dark:text-textdark"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white dark:bg-[#2C2B2B] p-6 rounded-lg shadow-lg max-w-2xl mx-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200"
                            onClick={() => setShowModal(false)}
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Právní upozornění</h2>
                        <p className="text-sm">
                            Uvedené značky automobilek, jsou ochrannými známkami jejich vlastníků a jejich uvedení je v souladu s ustanovením §10 odst. 1 písm. c) zákona č. 441/2003 Sb. O ochranných známkách v platném znění, neboť slouží k určení účelu výrobku nebo služby jiného původce, zejména u příslušenství nebo náhradních dílů.
                        </p>
                        <p className="text-sm mt-4">
                            Dle zákona 56/2001 Sb., o podmínkách provozu na pozemních komunikacích, informujeme naše zákazníky, že použití některých produktů z našeho katalogu může způsobit ztrátu způsobilosti silničního vozidla k provozu.
                            Neváhejte prosím kontaktovat náš personál, který Vám ochotně podá informace k výběru vhodného produktu pro Vaše vozidlo i ohledně jeho schválení.
                        </p>
                        <p className="text-sm mt-4">
                            Podle zákona o evidenci tržeb je prodávající povinen vystavit kupujícímu účtenku. Zároveň je povinen zaevidovat přijatou tržbu u správce daně on-line; v případě technického výpadku pak nejpozději do 48 hodin.
                        </p>
                        <button
                            className="mt-6 w-full py-2 bg-gray-300 dark:bg-accent border rounded-md hover:bg-gray-100 hover:dark:bg-bgdark transition-all duration-200"
                            onClick={() => setShowModal(false)}
                        >
                            Zavřít
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;