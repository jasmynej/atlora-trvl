import {trpc} from "./lib/trpc";

export default function App() {
    const {data} = trpc.countries.list.useQuery()
    if (data === undefined) {
        return <div>Loading...</div>;
    }
  return (
    <div>
        {data.map((country) => (
            <div key={country.code}>
                <h1>{country.name}</h1>
            </div>
        ))}
    </div>
  )
}
