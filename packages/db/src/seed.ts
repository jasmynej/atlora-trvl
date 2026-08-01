import "dotenv/config";
import { db } from "./index";
import { countries } from "./schema";

type Capital = {
  name: string;
  coordinates?: { lat?: number; lng?: number };
};

type RestCountry = {
  names: { common: string };
  codes: { alpha_3?: string };
  flag: { url_svg: string };
  region: string;
  subregion?: string;
  borders?: string[];
  capitals?: Capital[];
};

if (!process.env.RESTCOUNTRIES_TOKEN) {
  throw new Error("RESTCOUNTRIES_TOKEN is not set");
}

const res = await fetch(
  "https://api.restcountries.com/countries/v5?response_fields=names.common,codes.alpha_3,flag.url_svg,capitals,region,subregion,borders,coordinates.lat,coordinates.long&limit=100&offset=200",
  { headers: { Authorization: `Bearer ${process.env.RESTCOUNTRIES_TOKEN}` } }
);

if (!res.ok) {
  throw new Error(`REST Countries API error: ${res.status}`);
}

const countriesRes = await res.json();
const all: RestCountry[] = countriesRes.data.objects;
const rows = all.filter((c) => c.codes.alpha_3);

console.log(`Seeding ${rows.length} countries...`);

for (const c of rows) {
  const code = c.codes.alpha_3!;
  const values = {
    code,
    name: c.names.common,
    flagSvg: c.flag.url_svg,
    region: c.region,
    subRegion: c.subregion ?? "",
    borders: c.borders ?? [],
    capital: c.capitals?.[0]?.name ?? "",
    capitalLat: c.capitals?.[0]?.coordinates?.lat ?? 0,
    capitalLong: c.capitals?.[0]?.coordinates?.lng ?? 0,
  };

  await db
    .insert(countries)
    .values(values)
    .onConflictDoUpdate({ target: countries.code, set: values });
}

console.log("Done.");
process.exit(0);
