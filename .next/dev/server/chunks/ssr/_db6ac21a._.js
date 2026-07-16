module.exports = [
"[project]/lib/api/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCollection",
    ()=>getCollection,
    "getCollectionProducts",
    ()=>getCollectionProducts,
    "getCollections",
    ()=>getCollections,
    "getMenu",
    ()=>getMenu,
    "getPage",
    ()=>getPage,
    "getPages",
    ()=>getPages,
    "getProduct",
    ()=>getProduct,
    "getProductRecommendations",
    ()=>getProductRecommendations,
    "getProducts",
    ()=>getProducts
]);
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || "http://localhost:3000";
const PLACEHOLDER_IMAGE = {
    url: "/placeholder-product.png",
    altText: "Produto sem imagem",
    width: 800,
    height: 800
};
// Rótulo amigável pro tipo de embalagem
const unitTypeLabel = {
    unit: "Unidade",
    pack: "Pacote",
    box: "Caixa"
};
function variantTitle(variant) {
    const parts = [];
    if (variant.attributes) {
        for (const value of Object.values(variant.attributes)){
            parts.push(value);
        }
    }
    parts.push(`${unitTypeLabel[variant.unitType] || variant.unitType} (${variant.quantityPerUnit})`);
    return parts.join(" - ");
}
function reshapeVariant(variant) {
    const selectedOptions = [
        ...Object.entries(variant.attributes || {}).map(([name, value])=>({
                name,
                value
            })),
        {
            name: "Tipo",
            value: unitTypeLabel[variant.unitType] || variant.unitType
        }
    ];
    return {
        id: variant.id,
        title: variantTitle(variant),
        availableForSale: variant.stockQuantity > 0,
        selectedOptions,
        price: {
            amount: Number(variant.price).toFixed(2),
            currencyCode: "BRL"
        }
    };
}
function reshapeProduct(product) {
    const variants = product.variants.map(reshapeVariant);
    const prices = product.variants.map((v)=>Number(v.price));
    // Monta as opções (Cor, Número, Sabor, Tipo...) a partir de todas as variações
    const optionsMap = new Map();
    for (const variant of product.variants){
        const attrs = {
            ...variant.attributes,
            Tipo: unitTypeLabel[variant.unitType] || variant.unitType
        };
        for (const [name, value] of Object.entries(attrs)){
            if (!optionsMap.has(name)) optionsMap.set(name, new Set());
            optionsMap.get(name).add(value);
        }
    }
    const options = Array.from(optionsMap.entries()).map(([name, values])=>({
            id: name,
            name,
            values: Array.from(values)
        }));
    return {
        id: product.id,
        handle: product.id,
        availableForSale: product.variants.some((v)=>v.stockQuantity > 0),
        title: product.name,
        description: product.description || "",
        descriptionHtml: product.description ? `<p>${product.description}</p>` : "",
        options,
        priceRange: {
            minVariantPrice: {
                amount: Math.min(...prices).toFixed(2),
                currencyCode: "BRL"
            },
            maxVariantPrice: {
                amount: Math.max(...prices).toFixed(2),
                currencyCode: "BRL"
            }
        },
        variants,
        featuredImage: PLACEHOLDER_IMAGE,
        images: [
            PLACEHOLDER_IMAGE
        ],
        seo: {
            title: product.name,
            description: product.description || ""
        },
        tags: product.category ? [
            product.category
        ] : [],
        updatedAt: product.updatedAt
    };
}
async function apiFetch(path) {
    const res = await fetch(`${API_URL}${path}`, {
        next: {
            revalidate: 60
        }
    });
    if (!res.ok) {
        throw new Error(`Erro ao buscar ${path}: ${res.status}`);
    }
    return res.json();
}
async function getProducts({ query } = {}) {
    const products = await apiFetch("/products");
    const active = products.filter((p)=>p.active);
    const filtered = query ? active.filter((p)=>p.name.toLowerCase().includes(query.toLowerCase())) : active;
    return filtered.map(reshapeProduct);
}
async function getProduct(handle) {
    try {
        const product = await apiFetch(`/products/${handle}`);
        return reshapeProduct(product);
    } catch  {
        return undefined;
    }
}
async function getCollectionProducts({ collection }) {
    const products = await getProducts({});
    if (!collection) return products;
    return products.filter((p)=>p.tags.includes(collection));
}
async function getCollections() {
    const products = await getProducts({});
    const categories = Array.from(new Set(products.map((p)=>p.tags[0]).filter(Boolean)));
    return [
        {
            handle: "",
            title: "Todos",
            description: "Todos os produtos",
            seo: {
                title: "Todos",
                description: "Todos os produtos"
            },
            path: "/search",
            updatedAt: new Date().toISOString()
        },
        ...categories.map((category)=>({
                handle: category,
                title: category,
                description: category,
                seo: {
                    title: category,
                    description: category
                },
                path: `/search/${category}`,
                updatedAt: new Date().toISOString()
            }))
    ];
}
async function getCollection(handle) {
    const collections = await getCollections();
    return collections.find((c)=>c.handle === handle);
}
async function getMenu(_handle) {
    return [];
}
async function getProductRecommendations(productId) {
    const product = await getProduct(productId);
    if (!product) return [];
    const products = await getCollectionProducts({
        collection: product.tags[0] || ""
    });
    return products.filter((p)=>p.id !== productId).slice(0, 4);
}
async function getPage(handle) {
    return undefined;
}
async function getPages() {
    return [];
}
}),
"[project]/app/[page]/opengraph-image.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Image
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/opengraph-image.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/index.ts [app-rsc] (ecmascript)");
;
;
async function Image({ params }) {
    const page = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPage"])(params.page);
    const title = page.seo?.title || page.title;
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
        title
    });
}
}),
"[project]/app/[page]/opengraph-image--metadata.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$page$5d2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[page]/opengraph-image.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$lib$2f$metadata$2f$get$2d$metadata$2d$route$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/lib/metadata/get-metadata-route.js [app-rsc] (ecmascript)");
;
;
const imageModule = {};
async function __TURBOPACK__default__export__(props) {
    const { __metadata_id__: _, ...params } = await props.params;
    const imageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$lib$2f$metadata$2f$get$2d$metadata$2d$route$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fillMetadataSegment"])("/[page]", params, "opengraph-image");
    function getImageMetadata(imageMetadata, idParam) {
        const data = {
            alt: imageMetadata.alt,
            type: imageMetadata.contentType || 'image/png',
            url: imageUrl + (idParam ? '/' + idParam : '') + "?cf702c67403e2f70"
        };
        const { size } = imageMetadata;
        if (size) {
            data.width = size.width;
            data.height = size.height;
        }
        return data;
    }
    return [
        getImageMetadata(imageModule, '')
    ];
}
}),
];

//# sourceMappingURL=_db6ac21a._.js.map