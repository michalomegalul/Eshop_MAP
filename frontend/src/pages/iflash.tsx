import Header from "../components/header";
import Footer from "../components/footer";

function Iflash() {
    return (
        <>
            <Header />

            <main className='flex flex-col min-h-screen font-roboto bg-bglight dark:bg-bgdark'>
                {/* Hero Section */}
                <section
                    className="flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-16 md:px-28 md:py-24"
                >
                    <h1 className='text-4xl md:text-5xl font-bold text-textlight dark:text-textdark text-center drop-shadow-md'>
                        [Klient přestal spolupracovat = žádné info a obrázky]
                    </h1>
                    <p className='mt-4 text-lg md:text-xl text-textlight dark:text-textdark text-center max-w-2xl'>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, qui.
                    </p>
                </section>
            </main>

            <Footer />
        </>
    )
}

export default Iflash