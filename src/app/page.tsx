

export default function Home() {
  return (
    <div>
        <div className="w-full bg-brand-bg h-96 flex items-center  justify-between p-10">
            <div className="gap-3 flex flex-col w-2/4">
                <h1 className="text-4xl font-bold">Your agency's branded travel hub in minutes </h1>
                <p className="text-lg font-light">Showcase destinations, inspire travelers, and capture leads with ease</p>
                <div className="flex gap-3 text-lg">
                    <button className="bg-brand-primary rounded-full p-2 text-brand-bg hover:bg-brand-primary-hover transition ease-in-out duration-200">Get Started for Free</button>
                    <button className="underline">See Example Site</button>
                </div>
            </div>
            <div>
                <img src="/at-mockup.png" alt="mockup" className="w-72 h-72 drop-shadow-2xl"/>
            </div>
            <div>

            </div>
        </div>

    </div>
  )
}
