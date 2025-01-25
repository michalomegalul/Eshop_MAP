import Footer from '../components/footer'
import Heading from '../components/heading'
import Header from '../components/header'

function Home() {
    return (
        <>
            <main className='flex min-h-screen flex-col font-roboto bg-bglight'>
                <Header />

                {/* Main*/}
                <section className="flex flex-1 bg-cover bg-[url('/files/main.jpg')] px-28 py-[6%]"
                    style={{
                        backgroundImage: "linear-gradient(105deg, #FEF9F9 0%, rgba(254, 249, 249, 0.60) 28.21%, rgba(254, 249, 249, 0.05) 39.3%, rgba(254, 249, 249, 0.00) 79.85%), url('/files/main.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >

                    {/* vyresit fonty a weight fontu!!!!!!!!!!!!!! */}
                    <div className='flex flex-col gap-8'>
                        <h1 className='max-w-lg text-[#0F0001] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] font-rubik text-[48px] font-bold leading-[50px]'>Specialisté na výkon a péči o váš vůz.</h1>
                        <h2 className='max-w-sm text-[#0F0001] text-[16px] font-bold leading-[28px] tracking-[0.08px]'>Zajišťujeme profesionální servis, chip tuning a optimalizaci výkonu vašeho vozidla.</h2>
                    </div>

                </section>
            </main>

            {/* Actualities */}
            <section>
                <Heading text="Aktuality" />

            </section>

            {/* Services */}
            <section>
                <Heading text="Služby" />

            </section>

            {/* Team */}
            <section>
                <Heading text="Náš tým" />

            </section>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default Home