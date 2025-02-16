import { useState, useEffect } from 'react'
import Footer from '../components/footer'
import Heading from '../components/heading'
import Header from '../components/header'
import Carousel from '../components/Carousel'
import TeamCard from '../components/TeamCard'

function Home() {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

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
            <main className='flex min-h-screen flex-col font-roboto bg-bglight dark:bg-bgdark'>
                <Header />

                {/* Main */}
                <section
                    className="flex flex-1 bg-cover px-28 py-[6%]"
                    style={{
                        backgroundImage:
                            isDarkMode
                                ? "linear-gradient(105deg, #171717 0%, rgba(23, 23, 23, 0.60) 30.25%, rgba(23, 23, 23, 0.05) 46.13%, rgba(255, 255, 255, 0.00) 79.85%), url('/files/main.jpg')"
                                : "linear-gradient(105deg, #FEF9F9 0%, rgba(254, 249, 249, 0.60) 28.21%, rgba(254, 249, 249, 0.05) 39.3%, rgba(254, 249, 249, 0.00) 79.85%), url('/files/main.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className='flex flex-col gap-8'>
                        <h1 className='max-w-lg text-textlight dark:text-textdark drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] font-rubik text-[48px] font-bold leading-[50px]'>
                            Specialisté na výkon a péči o váš vůz.
                        </h1>
                        <h2 className='max-w-sm text-textlight dark:text-textdark text-[16px] font-bold leading-[28px] tracking-[0.08px]'>
                            Zajišťujeme profesionální servis, chip tuning a optimalizaci výkonu vašeho vozidla.
                        </h2>
                    </div>
                </section>
            </main>

            {/* Actualities */}
            <section>
                <Heading text="Aktuality" />
                <Carousel />
            </section>

            {/* Services */}
            <section>
                <Heading text="Služby" />

                <div className="grid grid-cols-2 grid-rows-3 gap-4 h-[900px] px-8 md:px-16 lg:px-32">
                    <div className='relative'>
                        <img src="/files/graf.jpg" className='h-full w-full rounded-sm' />
                        <p className='absolute left-7 bottom-3 font-semibold text-2xl text-textdark'>Softwarové úpravy řídících jednotek</p>
                    </div>
                    <div className="col-start-1 row-start-2 relative">
                        <img src="/files/dieselservis.jpg" className="h-full w-full rounded-sm" />
                        <p className='absolute left-7 bottom-3 font-semibold text-2xl text-textdark'>Dieselservis</p>
                    </div>
                    <div className="col-start-1 row-start-3 relative">
                        <img src="/files/seat.jpg" className="h-full w-full rounded-sm" />
                        <p className='absolute left-7 bottom-3 font-semibold text-2xl text-textdark'>Válcová zkušebna</p>
                    </div>
                    <div className="row-span-3 col-start-2 row-start-1 relative">
                        <img src="/files/dan.jpg" className="h-full w-full rounded-sm" />
                        <p className='absolute left-7 bottom-3 font-semibold text-2xl text-textdark'>Technici v terénu</p>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section id='team'>
                <Heading text="Náš tým" />
                <div className='flex flex-wrap justify-center px-8 md:px-16 lg:px-32 gap-24'>
                    <TeamCard
                        name="Richard Štrunc"
                        position="CEO"
                        description="Mozek firmy, tahoun a vizionář. Osobně zaštiťuje veškeré softwarové úpravy, dohlíží na detail. Ve firmě funguje od počátku její existence."
                        image="/files/richard.jpg"
                    />
                    <TeamCard
                        name="Richard Štrunc"
                        position="CEO"
                        description="Mozek firmy, tahoun a vizionář. Osobně zaštiťuje veškeré softwarové úpravy, dohlíží na detail. Ve firmě funguje od počátku její existence."
                        image="/files/richard.jpg"
                    />
                    <TeamCard
                        name="Richard Štrunc"
                        position="CEO"
                        description="Mozek firmy, tahoun a vizionář. Osobně zaštiťuje veškeré softwarové úpravy, dohlíží na detail. Ve firmě funguje od počátku její existence."
                        image="/files/richard.jpg"
                    />
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default Home;