import "dotenv/config";
import { db } from "./index";
import {
  regions,
  destinations,
  countriesToRegions,
  destinationsToRegions,
  poi,
  media,
  mediaAttachments,
} from "./schema";

// Real, working image URLs sourced from Wikimedia Commons (verified reachable
// at seed time). Each is attached as the "hero" image for its entity; entries
// in galleryImages are attached as "gallery" images, in array order.
type HeroImage = {
  key: string;
  url: string;
  width: number;
  height: number;
  altText: string;
  sourceUrl: string;
};

type GalleryImage = HeroImage;

const regionSeed = [
  {
    slug: "southeast-asia",
    name: "Southeast Asia",
    description:
      "Limestone karsts, golden temples, and street food capitals strung across Indonesia, Thailand, and Vietnam.",
    status: "PUBLISHED" as const,
    countryCodes: ["IDN", "THA", "VNM"],
    hero: {
      key: "region-southeast-asia-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Halong_Bay_in_Vietnam.jpg",
      width: 1920,
      height: 1280,
      altText: "Limestone karsts rising from the water in Ha Long Bay, Vietnam",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Halong_Bay_in_Vietnam.jpg",
    },
    galleryImages: [
      {
        key: "region-southeast-asia-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Railay_Beach_5.jpg/1920px-Railay_Beach_5.jpg",
        width: 1600,
        height: 958,
        altText: "Railay Beach, Thailand",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Railay_Beach_5.jpg",
      },
      {
        key: "region-southeast-asia-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Vietnam%2C_Phong_Dien%2C_Mekong_Delta%2C_River.jpg/1920px-Vietnam%2C_Phong_Dien%2C_Mekong_Delta%2C_River.jpg",
        width: 1600,
        height: 1067,
        altText: "The Mekong Delta near Phong Dien, Vietnam",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Vietnam,_Phong_Dien,_Mekong_Delta,_River.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "mediterranean-coast",
    name: "Mediterranean Coast",
    description:
      "Whitewashed clifftop towns, cliffside drives, and centuries of history along the Greek, Italian, and Spanish coastlines.",
    status: "PUBLISHED" as const,
    countryCodes: ["GRC", "ITA", "ESP"],
    hero: {
      key: "region-mediterranean-coast-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Atrani_%28Costiera_Amalfitana%2C_23-8-2011%29.jpg/1920px-Atrani_%28Costiera_Amalfitana%2C_23-8-2011%29.jpg",
      width: 1920,
      height: 1440,
      altText: "Cliffside village overlooking the sea on the Amalfi Coast, Italy",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg",
    },
    galleryImages: [
      {
        key: "region-mediterranean-coast-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Manarola_NW_Cemetery_Corniglia_Monterosso_Cinque_Terre_Sep23_A7C_06872.jpg/1920px-Manarola_NW_Cemetery_Corniglia_Monterosso_Cinque_Terre_Sep23_A7C_06872.jpg",
        width: 1600,
        height: 1067,
        altText: "Manarola in the Cinque Terre, Italy",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Manarola_NW_Cemetery_Corniglia_Monterosso_Cinque_Terre_Sep23_A7C_06872.jpg",
      },
      {
        key: "region-mediterranean-coast-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Windmills_of_Mykonos.jpg/1920px-Windmills_of_Mykonos.jpg",
        width: 1600,
        height: 1002,
        altText: "The windmills of Mykonos, Greece",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Windmills_of_Mykonos.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "caribbean-islands",
    name: "Caribbean Islands",
    description:
      "Reef-lined beaches and laid-back island life across Barbados, Turks and Caicos, and Jamaica.",
    status: "PUBLISHED" as const,
    countryCodes: ["BRB", "TCA", "JAM"],
    hero: {
      key: "region-caribbean-islands-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/The_Pitons_at_Soufriere_Saint_Lucia.jpg/1920px-The_Pitons_at_Soufriere_Saint_Lucia.jpg",
      width: 1600,
      height: 1200,
      altText: "The twin Piton peaks rising above the Caribbean Sea, Saint Lucia",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:The_Pitons_at_Soufriere_Saint_Lucia.jpg",
    },
    galleryImages: [
      {
        key: "region-caribbean-islands-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Beach_Palm_Trees_Riviera_Maya.jpg",
        width: 1600,
        height: 1066,
        altText: "Palm trees on a Caribbean beach",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Beach_Palm_Trees_Riviera_Maya.jpg",
      },
      {
        key: "region-caribbean-islands-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bahamas_1989_%28590%29_Great_Exuma_%2825248946179%29.jpg/1920px-Bahamas_1989_%28590%29_Great_Exuma_%2825248946179%29.jpg",
        width: 1600,
        height: 2377,
        altText: "Aerial view of Great Exuma, Bahamas",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Bahamas_1989_(590)_Great_Exuma_(25248946179).jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "east-africa-safari-circuit",
    name: "East Africa Safari Circuit",
    description:
      "Endless savanna and the great migration across Tanzania and Kenya's premier safari parks.",
    status: "PUBLISHED" as const,
    countryCodes: ["TZA", "KEN"],
    hero: {
      key: "region-east-africa-safari-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/040_Blue_wildebeest_with_wattled_starlings_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg/1920px-040_Blue_wildebeest_with_wattled_starlings_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg",
      width: 1920,
      height: 1280,
      altText: "Wildebeest crossing the savanna in Serengeti National Park, Tanzania",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:040_Blue_wildebeest_with_wattled_starlings_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg",
    },
    galleryImages: [
      {
        key: "region-east-africa-safari-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/013_Black-backed_jackal_in_the_Ngorongoro_Crater_Photo_by_Giles_Laurent.jpg/1920px-013_Black-backed_jackal_in_the_Ngorongoro_Crater_Photo_by_Giles_Laurent.jpg",
        width: 1600,
        height: 1144,
        altText: "A black-backed jackal in the Ngorongoro Crater, Tanzania",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:013_Black-backed_jackal_in_the_Ngorongoro_Crater_Photo_by_Giles_Laurent.jpg",
      },
      {
        key: "region-east-africa-safari-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro.jpg/1920px-Mount_Kilimanjaro.jpg",
        width: 1600,
        height: 718,
        altText: "Mount Kilimanjaro, Tanzania",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Mount_Kilimanjaro.jpg",
      },
    ] as GalleryImage[],
  },
];

const destinationSeed = [
  {
    slug: "bali",
    name: "Bali",
    type: "island" as const,
    status: "PUBLISHED" as const,
    tagline: "Temples, terraces, and turquoise water",
    description:
      "An Indonesian island known for its rice terraces, surf breaks, and Hindu temples perched above the sea.",
    bestTimeToVisit: "April to October (dry season)",
    countryCode: "IDN",
    regionSlug: "southeast-asia",
    hero: {
      key: "dest-bali-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bali%2C_Rice_fields%2C_Rice_terraces_in_East_Bali%2C_Indonesia.jpg/1920px-Bali%2C_Rice_fields%2C_Rice_terraces_in_East_Bali%2C_Indonesia.jpg",
      width: 1920,
      height: 1281,
      altText: "Terraced rice fields in East Bali, Indonesia",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Bali,_Rice_fields,_Rice_terraces_in_East_Bali,_Indonesia.jpg",
    },
    galleryImages: [
      {
        key: "dest-bali-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Uluwatu_Temple_sunset_-_Indonesia.jpg/1920px-Uluwatu_Temple_sunset_-_Indonesia.jpg",
        width: 1600,
        height: 2146,
        altText: "Uluwatu Temple at sunset, Bali",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Uluwatu_Temple_sunset_-_Indonesia.jpg",
      },
      {
        key: "dest-bali-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Rice_terraces_on_Bali_-_Tegalalang_Rice_Terrace_-_Indonesia_04.jpg/1920px-Rice_terraces_on_Bali_-_Tegalalang_Rice_Terrace_-_Indonesia_04.jpg",
        width: 1600,
        height: 2400,
        altText: "The Tegalalang Rice Terrace, Bali",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Rice_terraces_on_Bali_-_Tegalalang_Rice_Terrace_-_Indonesia_04.jpg",
      },
      {
        key: "dest-bali-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tanah_Lot%2C_Bali%2C_Indonesia%2C_20220827_0959_1118.jpg/1920px-Tanah_Lot%2C_Bali%2C_Indonesia%2C_20220827_0959_1118.jpg",
        width: 1600,
        height: 1068,
        altText: "Tanah Lot sea temple, Bali",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Tanah_Lot,_Bali,_Indonesia,_20220827_0959_1118.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    type: "city" as const,
    status: "PUBLISHED" as const,
    tagline: "Thailand's neon-lit capital",
    description:
      "A sprawling capital of ornate temples, floating markets, and some of the world's best street food.",
    bestTimeToVisit: "November to February (cool, dry season)",
    countryCode: "THA",
    regionSlug: "southeast-asia",
    hero: {
      key: "dest-bangkok-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bangkok_skytrain_sunset.jpg/1920px-Bangkok_skytrain_sunset.jpg",
      width: 1920,
      height: 1281,
      altText: "Bangkok skyline and skytrain at sunset",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Bangkok_skytrain_sunset.jpg",
    },
    galleryImages: [
      {
        key: "dest-bangkok-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_30.jpg/1920px-Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_30.jpg",
        width: 1600,
        height: 1069,
        altText: "Wat Arun temple, Bangkok",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Templo_Wat_Arun,_Bangkok,_Tailandia,_2013-08-22,_DD_30.jpg",
      },
      {
        key: "dest-bangkok-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Long_motorboat_on_the_Chao_Phraya_River_in_Bangkok.jpg/1920px-Long_motorboat_on_the_Chao_Phraya_River_in_Bangkok.jpg",
        width: 1600,
        height: 1200,
        altText: "A long-tail boat on the Chao Phraya River, Bangkok",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Long_motorboat_on_the_Chao_Phraya_River_in_Bangkok.jpg",
      },
      {
        key: "dest-bangkok-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Chatuchak_weekend_market_roofs.jpg/1920px-Chatuchak_weekend_market_roofs.jpg",
        width: 1600,
        height: 1200,
        altText: "The rooftops of Chatuchak Weekend Market, Bangkok",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Chatuchak_weekend_market_roofs.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "ha-long-bay",
    name: "Ha Long Bay",
    type: "other" as const,
    status: "PUBLISHED" as const,
    tagline: "Thousands of limestone islands rising from the sea",
    description:
      "A UNESCO World Heritage seascape in northern Vietnam, best explored by traditional junk boat.",
    bestTimeToVisit: "October to April",
    countryCode: "VNM",
    regionSlug: "southeast-asia",
    hero: {
      key: "dest-halong-bay-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Halong_Bay_in_Vietnam.jpg",
      width: 1920,
      height: 1280,
      altText: "Junk boats among the limestone karsts of Ha Long Bay",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Halong_Bay_in_Vietnam.jpg",
    },
    galleryImages: [
      {
        key: "dest-halong-bay-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Hang_Lu%E1%BB%93n_Cave%2C_Ha_Long_Bay%2C_Vietnam%2C_20240128_1452_3806.jpg/1920px-Hang_Lu%E1%BB%93n_Cave%2C_Ha_Long_Bay%2C_Vietnam%2C_20240128_1452_3806.jpg",
        width: 1600,
        height: 1068,
        altText: "Hang Luon Cave, Ha Long Bay",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Hang_Lu%E1%BB%93n_Cave,_Ha_Long_Bay,_Vietnam,_20240128_1452_3806.jpg",
      },
      {
        key: "dest-halong-bay-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Ha_Long_Bay_-_Halong1431.jpg/1920px-Ha_Long_Bay_-_Halong1431.jpg",
        width: 1600,
        height: 2133,
        altText: "A boat tour through Ha Long Bay",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Ha_Long_Bay_-_Halong1431.jpg",
      },
      {
        key: "dest-halong-bay-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/View_of_the_sea_from_Cannon_Fort_Park_on_Cat_Ba_Island%2C_Vietnam%2C_20240130_1601_4441.jpg/1920px-View_of_the_sea_from_Cannon_Fort_Park_on_Cat_Ba_Island%2C_Vietnam%2C_20240130_1601_4441.jpg",
        width: 1600,
        height: 1068,
        altText: "View of the sea from Cat Ba Island, near Ha Long Bay",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:View_of_the_sea_from_Cannon_Fort_Park_on_Cat_Ba_Island,_Vietnam,_20240130_1601_4441.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "santorini",
    name: "Santorini",
    type: "island" as const,
    status: "PUBLISHED" as const,
    tagline: "Blue domes and volcanic cliffs above the Aegean",
    description:
      "A Cycladic island famous for whitewashed villages, caldera sunsets, and volcanic beaches.",
    bestTimeToVisit: "Late April to early November",
    countryCode: "GRC",
    regionSlug: "mediterranean-coast",
    hero: {
      key: "dest-santorini-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/1000_Three_domes_of_Oia_in_Santorini_Photo_by_Giles_Laurent.jpg/1920px-1000_Three_domes_of_Oia_in_Santorini_Photo_by_Giles_Laurent.jpg",
      width: 1920,
      height: 1281,
      altText: "Blue-domed churches overlooking the caldera in Oia, Santorini",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:1000_Three_domes_of_Oia_in_Santorini_Photo_by_Giles_Laurent.jpg",
    },
    galleryImages: [
      {
        key: "dest-santorini-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Fira_-_caldera_-_estur_-_Grand_Celebration_-_Nea_Kameni_-_Santorini_-_Greece_-_01.jpg/1920px-Fira_-_caldera_-_estur_-_Grand_Celebration_-_Nea_Kameni_-_Santorini_-_Greece_-_01.jpg",
        width: 1600,
        height: 1059,
        altText: "The caldera view from Fira, Santorini",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Fira_-_caldera_-_estur_-_Grand_Celebration_-_Nea_Kameni_-_Santorini_-_Greece_-_01.jpg",
      },
      {
        key: "dest-santorini-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Crater_rim_-_Fira_-_Santorini_-_Greece_-_10.jpg/1920px-Crater_rim_-_Fira_-_Santorini_-_Greece_-_10.jpg",
        width: 1600,
        height: 1060,
        altText: "The crater rim above Fira, Santorini",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Crater_rim_-_Fira_-_Santorini_-_Greece_-_10.jpg",
      },
      {
        key: "dest-santorini-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Vlychada_-_Santorini_2019.jpg/1920px-Vlychada_-_Santorini_2019.jpg",
        width: 1600,
        height: 1067,
        altText: "Vlychada beach, Santorini",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Vlychada_-_Santorini_2019.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "amalfi-coast",
    name: "Amalfi Coast",
    type: "region_area" as const,
    status: "PUBLISHED" as const,
    tagline: "Cliffside towns above the Tyrrhenian Sea",
    description:
      "A dramatic stretch of Italian coastline linking Positano, Amalfi, and Ravello by winding coastal roads.",
    bestTimeToVisit: "May, June, September (shoulder season)",
    countryCode: "ITA",
    regionSlug: "mediterranean-coast",
    hero: {
      key: "dest-amalfi-coast-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/View_of_Positano.jpg/1920px-View_of_Positano.jpg",
      width: 1920,
      height: 1281,
      altText: "Pastel-colored houses stacked on the cliffs of Positano",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:View_of_Positano.jpg",
    },
    galleryImages: [
      {
        key: "dest-amalfi-coast-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Amalfi_Coast%2C_Italy_Panoramic.jpg/1920px-Amalfi_Coast%2C_Italy_Panoramic.jpg",
        width: 1600,
        height: 547,
        altText: "A panoramic view of the Amalfi Coast",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Amalfi_Coast,_Italy_Panoramic.jpg",
      },
      {
        key: "dest-amalfi-coast-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Thomas_Ender_-_A_view_of_the_Amalfi_coast_near_Ravello.jpg/1920px-Thomas_Ender_-_A_view_of_the_Amalfi_coast_near_Ravello.jpg",
        width: 1600,
        height: 1162,
        altText: "A view of the Amalfi Coast near Ravello",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Thomas_Ender_-_A_view_of_the_Amalfi_coast_near_Ravello.jpg",
      },
      {
        key: "dest-amalfi-coast-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Sentiero_degli_Dei_28_Campania.jpg/1920px-Sentiero_degli_Dei_28_Campania.jpg",
        width: 1600,
        height: 1973,
        altText: "The Path of the Gods hiking trail above the Amalfi Coast",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Sentiero_degli_Dei_28_Campania.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    type: "city" as const,
    status: "DRAFT" as const,
    tagline: "Gaudí's city on the Catalan coast",
    description:
      "A beach city known for Gaudí architecture, tapas culture, and the Gothic Quarter's narrow streets.",
    bestTimeToVisit: "May to June, September to October",
    countryCode: "ESP",
    regionSlug: "mediterranean-coast",
    hero: {
      key: "dest-barcelona-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Sagrada_Familia_March_2015-19bw.jpg/1920px-Sagrada_Familia_March_2015-19bw.jpg",
      width: 1920,
      height: 1281,
      altText: "The Sagrada Familia basilica in Barcelona",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sagrada_Familia_March_2015-19bw.jpg",
    },
    galleryImages: [
      {
        key: "dest-barcelona-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Park_G%C3%BCell_02.jpg/1920px-Park_G%C3%BCell_02.jpg",
        width: 1600,
        height: 1206,
        altText: "Park Güell, Barcelona",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Park_G%C3%BCell_02.jpg",
      },
      {
        key: "dest-barcelona-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Monument_a_Colom_-_Barcelona_-_Spain_-_panoramio.jpg/1920px-Monument_a_Colom_-_Barcelona_-_Spain_-_panoramio.jpg",
        width: 1600,
        height: 900,
        altText: "The Columbus Monument, Barcelona",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Monument_a_Colom_-_Barcelona_-_Spain_-_panoramio.jpg",
      },
      {
        key: "dest-barcelona-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/15-10-27-Vista_des_de_l%27est%C3%A0tua_de_Colom_a_Barcelona-WMA_2791.jpg/1920px-15-10-27-Vista_des_de_l%27est%C3%A0tua_de_Colom_a_Barcelona-WMA_2791.jpg",
        width: 1600,
        height: 2397,
        altText: "A view over Barcelona from the Columbus Monument",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:15-10-27-Vista_des_de_l%27est%C3%A0tua_de_Colom_a_Barcelona-WMA_2791.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "barbados",
    name: "Barbados",
    type: "island" as const,
    status: "PUBLISHED" as const,
    tagline: "The birthplace of rum, ringed by reef",
    description:
      "An easternmost Caribbean island with calm west-coast beaches, surf on the east coast, and a lively food scene.",
    bestTimeToVisit: "December to April (dry season)",
    countryCode: "BRB",
    regionSlug: "caribbean-islands",
    hero: {
      key: "dest-barbados-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Barbados_beach_%286735320631%29.jpg/1920px-Barbados_beach_%286735320631%29.jpg",
      width: 1920,
      height: 1281,
      altText: "A palm-lined beach in Barbados",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Barbados_beach_(6735320631).jpg",
    },
    galleryImages: [
      {
        key: "dest-barbados-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Approaching_Barbados_-_Bridgetown_Harbour_-_panoramio.jpg/1920px-Approaching_Barbados_-_Bridgetown_Harbour_-_panoramio.jpg",
        width: 1600,
        height: 761,
        altText: "Bridgetown Harbour, Barbados",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Approaching_Barbados_-_Bridgetown_Harbour_-_panoramio.jpg",
      },
      {
        key: "dest-barbados-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/View_from_The_Animal_Flower_Cave%2C_Barbados_%286807814333%29.jpg/1920px-View_from_The_Animal_Flower_Cave%2C_Barbados_%286807814333%29.jpg",
        width: 1600,
        height: 1127,
        altText: "The view from Animal Flower Cave, Barbados",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:View_from_The_Animal_Flower_Cave,_Barbados_(6807814333).jpg",
      },
      {
        key: "dest-barbados-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Harrisons_Cave_%286976862065%29.jpg/1920px-Harrisons_Cave_%286976862065%29.jpg",
        width: 1600,
        height: 1504,
        altText: "Harrison's Cave, Barbados",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Harrisons_Cave_(6976862065).jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "providenciales",
    name: "Providenciales",
    type: "island" as const,
    status: "PUBLISHED" as const,
    tagline: "Home to Grace Bay's powder-white sand",
    description:
      "The main tourist island of Turks and Caicos, anchored by the twelve-mile arc of Grace Bay Beach.",
    bestTimeToVisit: "December to April",
    countryCode: "TCA",
    regionSlug: "caribbean-islands",
    hero: {
      key: "dest-providenciales-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Grace_Bay_Beach_Facing_North_With_Clouds_In_the_Distance.jpg/1920px-Grace_Bay_Beach_Facing_North_With_Clouds_In_the_Distance.jpg",
      width: 1920,
      height: 1281,
      altText: "Grace Bay Beach in Providenciales, Turks and Caicos",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Grace_Bay_Beach_Facing_North_With_Clouds_In_the_Distance.jpg",
    },
    galleryImages: [
      {
        key: "dest-providenciales-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Providenciales_beach_03.jpg/1920px-Providenciales_beach_03.jpg",
        width: 1600,
        height: 1200,
        altText: "A beach in Providenciales, Turks and Caicos",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Providenciales_beach_03.jpg",
      },
      {
        key: "dest-providenciales-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Eagle_Ray_Turks_and_Caicos_Dec_15_2006.JPG/1920px-Eagle_Ray_Turks_and_Caicos_Dec_15_2006.JPG",
        width: 1600,
        height: 1067,
        altText: "An eagle ray in the waters off Turks and Caicos",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Eagle_Ray_Turks_and_Caicos_Dec_15_2006.JPG",
      },
    ] as GalleryImage[],
  },
  {
    slug: "negril",
    name: "Negril",
    type: "beach" as const,
    status: "DRAFT" as const,
    tagline: "Seven miles of sand on Jamaica's west coast",
    description:
      "A relaxed resort town famous for Seven Mile Beach and cliff-diving at Rick's Cafe.",
    bestTimeToVisit: "November to mid-December",
    countryCode: "JAM",
    regionSlug: "caribbean-islands",
    hero: {
      key: "dest-negril-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Jamaica%2C_Negril_-_Flickr_-_VV_Nincic.jpg/1920px-Jamaica%2C_Negril_-_Flickr_-_VV_Nincic.jpg",
      width: 1920,
      height: 1281,
      altText: "Seven Mile Beach in Negril, Jamaica",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Jamaica,_Negril_-_Flickr_-_VV_Nincic.jpg",
    },
    galleryImages: [
      {
        key: "dest-negril-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Rick%27s_Cafe%2C_Negril%2C_Jamaica_%28Unsplash%29.jpg/1920px-Rick%27s_Cafe%2C_Negril%2C_Jamaica_%28Unsplash%29.jpg",
        width: 1600,
        height: 1067,
        altText: "Rick's Cafe cliffs, Negril",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Rick%27s_Cafe,_Negril,_Jamaica_(Unsplash).jpg",
      },
      {
        key: "dest-negril-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Ricks_Negril_Jamaica_Photo_Don_Ramey_Logan.jpg/1920px-Ricks_Negril_Jamaica_Photo_Don_Ramey_Logan.jpg",
        width: 1600,
        height: 1063,
        altText: "Cliff diving at Rick's Cafe, Negril",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Ricks_Negril_Jamaica_Photo_Don_Ramey_Logan.jpg",
      },
      {
        key: "dest-negril-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Jamaica_-_Negril_-_048.jpg/1920px-Jamaica_-_Negril_-_048.jpg",
        width: 1600,
        height: 1200,
        altText: "Seven Mile Beach, Negril",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Jamaica_-_Negril_-_048.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "serengeti-national-park",
    name: "Serengeti National Park",
    type: "national_park" as const,
    status: "PUBLISHED" as const,
    tagline: "Endless plains and the great migration",
    description:
      "Tanzania's flagship safari park, home to the annual wildebeest migration and year-round big-cat sightings.",
    bestTimeToVisit: "June to October (dry season, best game viewing)",
    countryCode: "TZA",
    regionSlug: "east-africa-safari-circuit",
    hero: {
      key: "dest-serengeti-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/011_The_lion_king_Tryggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg/1920px-011_The_lion_king_Tryggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg",
      width: 1920,
      height: 1281,
      altText: "A lion resting on the plains of the Serengeti",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:011_The_lion_king_Tryggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg",
    },
    galleryImages: [
      {
        key: "dest-serengeti-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Serengeti_Elefantenbulle.jpg/1920px-Serengeti_Elefantenbulle.jpg",
        width: 1600,
        height: 1067,
        altText: "An elephant bull in the Serengeti",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Serengeti_Elefantenbulle.jpg",
      },
      {
        key: "dest-serengeti-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Serengeti_Balloon.jpg/1920px-Serengeti_Balloon.jpg",
        width: 1600,
        height: 900,
        altText: "A hot air balloon safari over the Serengeti",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Serengeti_Balloon.jpg",
      },
      {
        key: "dest-serengeti-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Acacia_tree_on_a_sunrise_safari_at_the_Serengeti_National_Park%2C_Tanzania.jpg/1920px-Acacia_tree_on_a_sunrise_safari_at_the_Serengeti_National_Park%2C_Tanzania.jpg",
        width: 1600,
        height: 1200,
        altText: "An acacia tree at sunrise in the Serengeti",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Acacia_tree_on_a_sunrise_safari_at_the_Serengeti_National_Park,_Tanzania.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "zanzibar",
    name: "Zanzibar",
    type: "island" as const,
    status: "PUBLISHED" as const,
    tagline: "Spice-scented beaches off the Tanzanian coast",
    description:
      "An Indian Ocean island pairing Stone Town's Swahili architecture with reef-lined northern beaches.",
    bestTimeToVisit: "June to October",
    countryCode: "TZA",
    regionSlug: "east-africa-safari-circuit",
    hero: {
      key: "dest-zanzibar-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Puerto_de_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_03.jpg/1920px-Puerto_de_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_03.jpg",
      width: 1920,
      height: 1281,
      altText: "The waterfront of Stone Town, Zanzibar",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Puerto_de_Stone_Town,_Zanz%C3%ADbar,_Tanzania,_2024-05-31,_DD_03.jpg",
    },
    galleryImages: [
      {
        key: "dest-zanzibar-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Handmade_Crown_by_Spice_Farm_artists%2C_Zanzibar.jpg/1920px-Handmade_Crown_by_Spice_Farm_artists%2C_Zanzibar.jpg",
        width: 1600,
        height: 1394,
        altText: "A spice farm artisan in Zanzibar",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Handmade_Crown_by_Spice_Farm_artists,_Zanzibar.jpg",
      },
      {
        key: "dest-zanzibar-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Nungwi-Beach-Zanzibar.jpg",
        width: 1600,
        height: 955,
        altText: "Nungwi Beach, Zanzibar",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Nungwi-Beach-Zanzibar.jpg",
      },
      {
        key: "dest-zanzibar-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Isla_Changuu%2C_Tanzania%2C_2024-05-31%2C_DD_05.jpg/1920px-Isla_Changuu%2C_Tanzania%2C_2024-05-31%2C_DD_05.jpg",
        width: 1600,
        height: 441,
        altText: "Prison Island, off the coast of Zanzibar",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Isla_Changuu,_Tanzania,_2024-05-31,_DD_05.jpg",
      },
    ] as GalleryImage[],
  },
  {
    slug: "maasai-mara",
    name: "Maasai Mara",
    type: "national_park" as const,
    status: "PUBLISHED" as const,
    tagline: "Kenya's classic safari reserve",
    description:
      "A vast savanna reserve bordering the Serengeti, renowned for dense predator populations and Maasai culture.",
    bestTimeToVisit: "July to October (migration season)",
    countryCode: "KEN",
    regionSlug: "east-africa-safari-circuit",
    hero: {
      key: "dest-maasai-mara-hero",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Three_zebras_in_Masai_Mara_National_Park%2C_Kenya.jpg/1920px-Three_zebras_in_Masai_Mara_National_Park%2C_Kenya.jpg",
      width: 1920,
      height: 1281,
      altText: "Zebras grazing in Maasai Mara National Reserve",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Three_zebras_in_Masai_Mara_National_Park,_Kenya.jpg",
    },
    galleryImages: [
      {
        key: "dest-maasai-mara-gallery-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/African_elephants_in_Maasai_Mara_National_Reserve_-_Kenya.jpg",
        width: 1600,
        height: 982,
        altText: "African elephants in Maasai Mara National Reserve",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:African_elephants_in_Maasai_Mara_National_Reserve_-_Kenya.jpg",
      },
      {
        key: "dest-maasai-mara-gallery-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Wildebeest_Jumping_Into_the_Mara_River.jpg/1920px-Wildebeest_Jumping_Into_the_Mara_River.jpg",
        width: 1600,
        height: 973,
        altText: "Wildebeest crossing the Mara River",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Wildebeest_Jumping_Into_the_Mara_River.jpg",
      },
      {
        key: "dest-maasai-mara-gallery-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Maasai_people_in_a_village_on_the_A109_road%2C_Kenya_2.jpg/1920px-Maasai_people_in_a_village_on_the_A109_road%2C_Kenya_2.jpg",
        width: 1600,
        height: 1200,
        altText: "A Maasai village near the Mara, Kenya",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Maasai_people_in_a_village_on_the_A109_road,_Kenya_2.jpg",
      },
    ] as GalleryImage[],
  },
];

const poiSeed = [
  // Bali
  {
    slug: "bali-uluwatu-temple",
    name: "Uluwatu Temple",
    type: "attraction" as const,
    destinationSlug: "bali",
    lat: -8.8291,
    lng: 115.0849,
    address: "Pecatu, South Kuta, Badung Regency, Bali, Indonesia",
    summary: "A sea temple perched on a cliff, famous for sunset Kecak fire dances.",
    website: null,
  },
  {
    slug: "bali-potato-head-beach-club",
    name: "Potato Head Beach Club",
    type: "restaurant" as const,
    destinationSlug: "bali",
    lat: -8.6858,
    lng: 115.157,
    address: "Jl. Petitenget, Seminyak, Bali, Indonesia",
    summary: "Beachfront restaurant and club overlooking Seminyak Beach.",
    website: "https://potatohead.co",
  },
  {
    slug: "bali-four-seasons-sayan",
    name: "Four Seasons Resort Bali at Sayan",
    type: "hotel" as const,
    destinationSlug: "bali",
    lat: -8.4931,
    lng: 115.2494,
    address: "Sayan, Ubud, Gianyar, Bali, Indonesia",
    summary: "A jungle-canopy resort set into the Ayung River valley near Ubud.",
    website: "https://www.fourseasons.com/sayan",
  },
  {
    slug: "bali-ngurah-rai-airport",
    name: "Ngurah Rai International Airport",
    type: "aiport" as const,
    destinationSlug: "bali",
    lat: -8.7482,
    lng: 115.1672,
    address: "Kuta, Badung Regency, Bali, Indonesia",
    summary: "Bali's main international gateway, serving Denpasar (DPS).",
    website: null,
  },
  // Bangkok
  {
    slug: "bangkok-grand-palace",
    name: "Grand Palace",
    type: "attraction" as const,
    destinationSlug: "bangkok",
    lat: 13.75,
    lng: 100.4913,
    address: "Na Phra Lan Rd, Phra Nakhon, Bangkok, Thailand",
    summary: "The former royal residence and home to the Temple of the Emerald Buddha.",
    website: null,
  },
  {
    slug: "bangkok-suvarnabhumi-airport",
    name: "Suvarnabhumi Airport",
    type: "aiport" as const,
    destinationSlug: "bangkok",
    lat: 13.6900,
    lng: 100.7501,
    address: "Racha Thewa, Bang Phli, Samut Prakan, Thailand",
    summary: "Bangkok's principal international airport (BKK).",
    website: null,
  },
  {
    slug: "bangkok-chatuchak-market",
    name: "Chatuchak Weekend Market",
    type: "neighborhood" as const,
    destinationSlug: "bangkok",
    lat: 13.7999,
    lng: 100.5501,
    address: "Kamphaeng Phet 2 Rd, Chatuchak, Bangkok, Thailand",
    summary: "One of the world's largest weekend markets, with thousands of stalls.",
    website: null,
  },
  // Santorini
  {
    slug: "santorini-oia",
    name: "Oia",
    type: "neighborhood" as const,
    destinationSlug: "santorini",
    lat: 36.4614,
    lng: 25.3753,
    address: "Oia, Santorini, Greece",
    summary: "A cliffside village famous for blue-domed churches and caldera sunsets.",
    website: null,
  },
  {
    slug: "santorini-airport",
    name: "Santorini (Thira) National Airport",
    type: "aiport" as const,
    destinationSlug: "santorini",
    lat: 36.3992,
    lng: 25.4793,
    address: "Monolithos, Santorini, Greece",
    summary: "Santorini's airport (JTR), on the island's east coast.",
    website: null,
  },
  {
    slug: "santorini-canaves-oia-suites",
    name: "Canaves Oia Suites",
    type: "hotel" as const,
    destinationSlug: "santorini",
    lat: 36.4616,
    lng: 25.3757,
    address: "Oia, Santorini, Greece",
    summary: "A cliffside suite hotel carved into Oia's caldera-facing cliffs.",
    website: "https://www.canaves.com",
  },
  // Barbados
  {
    slug: "barbados-bridgetown",
    name: "Bridgetown",
    type: "neighborhood" as const,
    destinationSlug: "barbados",
    lat: 13.0969,
    lng: -59.6145,
    address: "Bridgetown, Barbados",
    summary: "Barbados's capital and a UNESCO World Heritage historic centre.",
    website: null,
  },
  {
    slug: "barbados-grantley-adams-airport",
    name: "Grantley Adams International Airport",
    type: "aiport" as const,
    destinationSlug: "barbados",
    lat: 13.0746,
    lng: -59.4925,
    address: "Christ Church, Barbados",
    summary: "Barbados's international airport (BGI), on the south coast.",
    website: null,
  },
  {
    slug: "barbados-sandy-lane",
    name: "Sandy Lane",
    type: "hotel" as const,
    destinationSlug: "barbados",
    lat: 13.0961,
    lng: -59.6383,
    address: "Sandy Lane, Saint James, Barbados",
    summary: "A luxury beachfront resort on Barbados's west coast.",
    website: "https://www.sandylane.com",
  },
  {
    slug: "barbados-oistins-fish-fry",
    name: "Oistins Fish Fry",
    type: "restaurant" as const,
    destinationSlug: "barbados",
    lat: 13.0656,
    lng: -59.5364,
    address: "Oistins, Christ Church, Barbados",
    summary: "A weekly open-air fish fry and street party on the south coast.",
    website: null,
  },
  // Serengeti National Park
  {
    slug: "serengeti-seronera-airstrip",
    name: "Seronera Airstrip",
    type: "aiport" as const,
    destinationSlug: "serengeti-national-park",
    lat: -2.4581,
    lng: 34.8222,
    address: "Seronera, Serengeti National Park, Tanzania",
    summary: "The main airstrip serving central Serengeti safari camps.",
    website: null,
  },
  {
    slug: "serengeti-four-seasons-safari-lodge",
    name: "Four Seasons Safari Lodge Serengeti",
    type: "hotel" as const,
    destinationSlug: "serengeti-national-park",
    lat: -2.3306,
    lng: 34.8331,
    address: "Central Serengeti, Serengeti National Park, Tanzania",
    summary: "A lodge overlooking a watering hole in the heart of the Serengeti.",
    website: "https://www.fourseasons.com/serengeti",
  },
  {
    slug: "serengeti-naabi-hill-gate",
    name: "Naabi Hill Gate",
    type: "attraction" as const,
    destinationSlug: "serengeti-national-park",
    lat: -2.8342,
    lng: 35.0022,
    address: "Naabi Hill, Serengeti National Park, Tanzania",
    summary: "The main southeastern entrance gate to Serengeti National Park.",
    website: null,
  },
];

// Not every POI has a usable free-license photo on Commons — commercial
// venues (branded hotels, restaurants) are frequently absent. Those POI
// slugs are simply omitted here rather than forced to a mismatched image.
const poiImageBySlug: Record<string, HeroImage> = {
  "bali-uluwatu-temple": {
    key: "poi-bali-uluwatu-temple-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Luhur_Uluwatu_Temple%2C_Bali%2C_20220826_0953_1016.jpg/1920px-Luhur_Uluwatu_Temple%2C_Bali%2C_20220826_0953_1016.jpg",
    width: 1600,
    height: 1068,
    altText: "Uluwatu Temple perched on the cliffs of Bali",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Luhur_Uluwatu_Temple,_Bali,_20220826_0953_1016.jpg",
  },
  "bali-four-seasons-sayan": {
    key: "poi-bali-four-seasons-sayan-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Bali_Urwald_SvG.jpg",
    width: 1600,
    height: 937,
    altText: "Jungle canopy near the Ayung River, Ubud",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bali_Urwald_SvG.jpg",
  },
  "bali-ngurah-rai-airport": {
    key: "poi-bali-ngurah-rai-airport-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Denpasar_Bali_Indonesia_Denpasar-International-Airport-01.jpg/1920px-Denpasar_Bali_Indonesia_Denpasar-International-Airport-01.jpg",
    width: 1600,
    height: 1067,
    altText: "Ngurah Rai International Airport, Bali",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Denpasar_Bali_Indonesia_Denpasar-International-Airport-01.jpg",
  },
  "bangkok-grand-palace": {
    key: "poi-bangkok-grand-palace-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%94%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7_%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3_-_Wat_Phra_Kaew%2C_Temple_of_Emerald_Buddha%2C_Bangkok%2C_Thailand.jpg/1920px-thumbnail.jpg",
    width: 1600,
    height: 1160,
    altText: "Wat Phra Kaew, Temple of the Emerald Buddha, at the Grand Palace",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%94%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7_%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3_-_Wat_Phra_Kaew,_Temple_of_Emerald_Buddha,_Bangkok,_Thailand.jpg",
  },
  "bangkok-suvarnabhumi-airport": {
    key: "poi-bangkok-suvarnabhumi-airport-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Green-faced_Yaksha_statue_at_Suvarnabhumi_Airport_in_Bangkok.jpg/1920px-Green-faced_Yaksha_statue_at_Suvarnabhumi_Airport_in_Bangkok.jpg",
    width: 1600,
    height: 2844,
    altText: "A guardian statue at Suvarnabhumi Airport, Bangkok",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Green-faced_Yaksha_statue_at_Suvarnabhumi_Airport_in_Bangkok.jpg",
  },
  "bangkok-chatuchak-market": {
    key: "poi-bangkok-chatuchak-market-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Chatuchak_weekend_market_outdoor_stalls_2.JPG/1920px-Chatuchak_weekend_market_outdoor_stalls_2.JPG",
    width: 1600,
    height: 1200,
    altText: "Outdoor stalls at Chatuchak Weekend Market",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Chatuchak_weekend_market_outdoor_stalls_2.JPG",
  },
  "santorini-oia": {
    key: "poi-santorini-oia-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Village_Oia%2C_Santorini%2C_Gr%C3%A8ce%2C_2017.jpg",
    width: 1600,
    height: 2133,
    altText: "The village of Oia, Santorini",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Village_Oia,_Santorini,_Gr%C3%A8ce,_2017.jpg",
  },
  "santorini-airport": {
    key: "poi-santorini-airport-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Kamari_and_airport.jpg",
    width: 1600,
    height: 1200,
    altText: "Santorini (Thira) National Airport",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kamari_and_airport.jpg",
  },
  "barbados-bridgetown": {
    key: "poi-barbados-bridgetown-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/AIDAperla_in_Bridgetown%2C_Barbados_-_February_2020.jpg/1920px-AIDAperla_in_Bridgetown%2C_Barbados_-_February_2020.jpg",
    width: 1600,
    height: 652,
    altText: "A cruise ship docked in Bridgetown, Barbados",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:AIDAperla_in_Bridgetown,_Barbados_-_February_2020.jpg",
  },
  "barbados-grantley-adams-airport": {
    key: "poi-barbados-grantley-adams-airport-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Sir_Grantley_Adams_Int_Airport%2C_Barbados-05.jpg",
    width: 1600,
    height: 1200,
    altText: "Grantley Adams International Airport, Barbados",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sir_Grantley_Adams_Int_Airport,_Barbados-05.jpg",
  },
  "barbados-sandy-lane": {
    key: "poi-barbados-sandy-lane-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Sandy_Lane.jpg/1920px-Sandy_Lane.jpg",
    width: 1600,
    height: 1063,
    altText: "Sandy Lane resort, Barbados",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sandy_Lane.jpg",
  },
  "barbados-oistins-fish-fry": {
    key: "poi-barbados-oistins-fish-fry-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Oistins_shoreline_Barbados.jpg/1920px-Oistins_shoreline_Barbados.jpg",
    width: 1600,
    height: 1200,
    altText: "The Oistins shoreline, Barbados",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Oistins_shoreline_Barbados.jpg",
  },
  "serengeti-seronera-airstrip": {
    key: "poi-serengeti-seronera-airstrip-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Seronera_Airstrip.jpg/1920px-Seronera_Airstrip.jpg",
    width: 1600,
    height: 1200,
    altText: "Seronera Airstrip, Serengeti National Park",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Seronera_Airstrip.jpg",
  },
  "serengeti-naabi-hill-gate": {
    key: "poi-serengeti-naabi-hill-gate-hero",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Common_Agama_at_Naabi_Hill_Gate%2C_Serengeti%2C_Tanzania.jpg/1920px-Common_Agama_at_Naabi_Hill_Gate%2C_Serengeti%2C_Tanzania.jpg",
    width: 1600,
    height: 900,
    altText: "Naabi Hill Gate, Serengeti National Park",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_Agama_at_Naabi_Hill_Gate,_Serengeti,_Tanzania.jpg",
  },
};

async function seedRegions() {
  const idBySlug = new Map<string, string>();

  for (const r of regionSeed) {
    const [row] = await db
      .insert(regions)
      .values({
        slug: r.slug,
        name: r.name,
        description: r.description,
        status: r.status,
      })
      .onConflictDoUpdate({
        target: regions.slug,
        set: { name: r.name, description: r.description, status: r.status },
      })
      .returning({ id: regions.id, slug: regions.slug });
    idBySlug.set(row!.slug, row!.id);
  }

  for (const r of regionSeed) {
    const regionId = idBySlug.get(r.slug)!;
    for (const countryCode of r.countryCodes) {
      await db
        .insert(countriesToRegions)
        .values({ countryCode, regionId })
        .onConflictDoNothing();
    }
  }

  return idBySlug;
}

async function seedDestinations(regionIdBySlug: Map<string, string>) {
  const idBySlug = new Map<string, string>();

  for (const d of destinationSeed) {
    const [row] = await db
      .insert(destinations)
      .values({
        slug: d.slug,
        name: d.name,
        type: d.type,
        status: d.status,
        tagline: d.tagline,
        description: d.description,
        bestTimeToVisit: d.bestTimeToVisit,
        countryCode: d.countryCode,
      })
      .onConflictDoUpdate({
        target: destinations.slug,
        set: {
          name: d.name,
          type: d.type,
          status: d.status,
          tagline: d.tagline,
          description: d.description,
          bestTimeToVisit: d.bestTimeToVisit,
          countryCode: d.countryCode,
        },
      })
      .returning({ id: destinations.id, slug: destinations.slug });
    idBySlug.set(row!.slug, row!.id);
  }

  for (const d of destinationSeed) {
    const destinationId = idBySlug.get(d.slug)!;
    const regionId = regionIdBySlug.get(d.regionSlug)!;
    await db
      .insert(destinationsToRegions)
      .values({ destinationId, regionId })
      .onConflictDoNothing();
  }

  return idBySlug;
}

async function seedPois(destinationIdBySlug: Map<string, string>) {
  const idBySlug = new Map<string, string>();

  for (const p of poiSeed) {
    const [row] = await db
      .insert(poi)
      .values({
        slug: p.slug,
        name: p.name,
        type: p.type,
        destinationId: destinationIdBySlug.get(p.destinationSlug)!,
        lat: p.lat,
        lng: p.lng,
        address: p.address,
        summary: p.summary,
        website: p.website,
      })
      .onConflictDoUpdate({
        target: poi.slug,
        set: {
          name: p.name,
          type: p.type,
          lat: p.lat,
          lng: p.lng,
          address: p.address,
          summary: p.summary,
          website: p.website,
        },
      })
      .returning({ id: poi.id, slug: poi.slug });
    idBySlug.set(row!.slug, row!.id);
  }

  return idBySlug;
}

async function seedImage(
  entityType: "region" | "destination" | "poi",
  image: HeroImage,
  entityId: string,
  role: "hero" | "gallery",
  sortOrder: number
) {
  const [mediaRow] = await db
    .insert(media)
    .values({
      key: image.key,
      url: image.url,
      altText: image.altText,
      width: image.width,
      height: image.height,
      mimeType: "image/jpeg",
    })
    .onConflictDoUpdate({
      target: media.key,
      set: { url: image.url, altText: image.altText, width: image.width, height: image.height },
    })
    .returning({ id: media.id });

  await db
    .insert(mediaAttachments)
    .values({
      mediaId: mediaRow!.id,
      entityType,
      entityId,
      role,
      sortOrder,
    })
    .onConflictDoNothing();
}

async function main() {
  console.log("Seeding regions...");
  const regionIdBySlug = await seedRegions();

  console.log("Seeding destinations...");
  const destinationIdBySlug = await seedDestinations(regionIdBySlug);

  console.log("Seeding POIs...");
  const poiIdBySlug = await seedPois(destinationIdBySlug);

  console.log("Attaching hero images...");
  for (const r of regionSeed) {
    await seedImage("region", r.hero, regionIdBySlug.get(r.slug)!, "hero", 0);
  }
  for (const d of destinationSeed) {
    await seedImage("destination", d.hero, destinationIdBySlug.get(d.slug)!, "hero", 0);
  }

  console.log("Attaching gallery images...");
  let galleryCount = 0;
  for (const r of regionSeed) {
    const entityId = regionIdBySlug.get(r.slug)!;
    for (const [i, img] of r.galleryImages.entries()) {
      await seedImage("region", img, entityId, "gallery", i + 1);
      galleryCount++;
    }
  }
  for (const d of destinationSeed) {
    const entityId = destinationIdBySlug.get(d.slug)!;
    for (const [i, img] of d.galleryImages.entries()) {
      await seedImage("destination", img, entityId, "gallery", i + 1);
      galleryCount++;
    }
  }

  console.log("Attaching POI images...");
  let poiImageCount = 0;
  for (const [slug, img] of Object.entries(poiImageBySlug)) {
    const entityId = poiIdBySlug.get(slug);
    if (!entityId) continue;
    await seedImage("poi", img, entityId, "hero", 0);
    poiImageCount++;
  }

  console.log(
    `Done. Seeded ${regionSeed.length} regions, ${destinationSeed.length} destinations, ${poiSeed.length} POIs, ${regionSeed.length + destinationSeed.length} hero images, ${galleryCount} gallery images, and ${poiImageCount} POI images.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
