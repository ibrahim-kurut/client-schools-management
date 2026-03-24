import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import PriceCard from "./PriceCard"
import pricingPlans from "./pricingPlans.json"

const PricesPage = () => {
    return (


        <div className="min-h-screen font-sans flex flex-col">
            <Navbar />
            <main className="flex-1">
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                            خطط أسعار تناسب احتياج مدرستك
                        </h1>
                    </div>

                    <div className="mt-10 grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                        {pricingPlans.map((plan) => (
                            <PriceCard key={plan.id} plan={plan} />
                        ))}
                    </div>

                </section>
            </main>
            <Footer />
        </div>







    )
}

export default PricesPage