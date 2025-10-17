import {Agency} from "@prisma/client";

export const EMPTY_AGENCY: Agency = {
    id: "",
    slug: "",
    name: "",
    theme: {},
    contact: "",
    createdAt: new Date(0),
    logo: null,
    updatedAt: new Date(0)
};

export const AltoraTheme = {
    colors: {
        "brand-primary": "#0091AB",
        "brand-primary-hover": "#008198",
        "brand-accent-1": "#F7AAC1",
        "brand-accent-1-hover": "#F37B9F",
        "brand-accent-2": "#E7B06F",
        "brand-accent-2-hover": "#E09D4B",
        "brand-accent-3": "#B9B1C9",
        "brand-accent-3-hover": "#A095B5",
        "brand-bg": "#FAF8F6",
        "brand-text": "#343432",
    },
    fonts: {
        heading: {
            family: "Bodoni Moda",
            weights: [400, 500, 600],
            ital: true
        },
        body: {
            family: "Nunito Sans",
            weights: [200, 300, 400, 500, 600],
            ital: false
        },
    },
} as const;