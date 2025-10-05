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