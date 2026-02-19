/**
 * ASOS API Category IDs organized by gender and garment type
 * Based on official ASOS navigation structure
 */

export interface CategoryMapping {
    [key: string]: {
        id: string;
        name: string;
    };
}

export const asosCategories = {

    women: {
        hat: {
            id: "27109", // Accessories (includes hats)
            name: "Hats & Accessories"
        },
        top: {
            id: "2623", // New In Clothing (good variety of tops)
            name: "Tops & Clothing"
        },
        dress: {
            id: "8799", // Dresses View All
            name: "Dresses"
        },
        jeans: {
            id: "52535", // Denim Shop View all
            name: "Jeans & Denim"
        },
        shoes: {
            id: "6992", // New In Shoes
            name: "Shoes"
        },
        accessories: {
            id: "27109", // New In Accessories
            name: "Accessories"
        }
    },
    men: {
        hat: {
            id: "27112", // Accessories (includes hats)
            name: "Hats & Accessories"
        },
        top: {
            id: "9172",    // Graphic Tees
            name: "Tops & Clothing"
        },
        jeans: {
            id: "20753", // Tall section (has good variety with filters)
            name: "Jeans & Pants"
        },
        shoes: {
            id: "51965", // New In Shoes
            name: "Shoes"
        },
        accessories: {
            id: "27112", // Accessories
            name: "Accessories"
        }
    }
} as const;

export const specialtyCategories = {
    women: {
        dresses: {
            party: "11057",      // Party Dresses
            casual: "8834",      // Casual Dresses
            evening: "8857",     // Evening Dresses
            mini: "13597",       // Mini Dresses
            midi: "12899",       // Midi Dresses
            maxi: "9979"         // Maxi Dresses
        },
        jeans: {
            barrel: "52368",     // Barrel Jeans
            straight: "50616",   // Straight Leg Jeans
            wide: "28017",       // Wide Leg Jeans
            boyfriend: "11309"   // Relaxed/Boyfriend Jeans
        },
        footwear: {
            boots: "6455",       // From our testing - boots category
            sandals: "6461",     // From our testing - sandals
            flats: "6459"        // From our testing - ballet flats
        }
    },

    men: {
        footwear: {
            sneakers: "17184",   // Sneakers
            casual: "6456",      // From our testing - sneakers category
            boots: "6455"        // From our testing - boots (may work for men too)
        },
        styles: {
            streetwear: "17565", // Streetwear
            workwear: "18423",   // Modern Workwear
            graphics: "9172",     // Graphic Tees
            id2: "51964", // New In Clothing
        }
    }
};

export function getCategoryId(garmentType: string, gender: 'women' | 'men' | 'all'): string | undefined | string[] {
    console.log("Getting category for:", garmentType, gender);

    if (gender === 'all') {
        // Return both men's and women's category IDs
        const menId = asosCategories.men[garmentType as keyof typeof asosCategories.men]?.id;
        const womenId = asosCategories.women[garmentType as keyof typeof asosCategories.women]?.id;

        const ids = [];
        if (menId) ids.push(menId);
        if (womenId) ids.push(womenId);

        return ids.length > 0 ? ids : undefined;
    }

    // Handle specific gender
    const categories = asosCategories[gender as keyof typeof asosCategories];
    return categories?.[garmentType as keyof typeof categories]?.id;
}

export function getCategoryName(garmentType: string, gender: 'women' | 'men' | 'all'): string {
    const categories = gender === 'all' ? { ...asosCategories.women, ...asosCategories.men } : asosCategories[gender];

    if (categories && categories[garmentType as keyof typeof categories]) {
        return categories[garmentType as keyof typeof categories].name;
    }

    return garmentType.charAt(0).toUpperCase() + garmentType.slice(1);
}

export function getAvailableGarmentTypes(gender: 'women' | 'men'): string[] {
    return Object.keys(asosCategories[gender]);
}