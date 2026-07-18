module.exports = [
"[project]/lib/api/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createOrder",
    ()=>createOrder,
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
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || "http://localhost:3001";
const PLACEHOLDER_IMAGE = {
    url: "/placeholder-product.png",
    altText: "Produto sem imagem",
    width: 800,
    height: 800
};
function reshapeVariant(variant) {
    const selectedOptions = Object.entries(variant.attributes || {}).map(([name, value])=>({
            name,
            value
        }));
    const title = selectedOptions.length > 0 ? selectedOptions.map((o)=>o.value).join(" - ") : "Padrão";
    const unitPrice = {
        amount: Number(variant.unitPrice).toFixed(2),
        currencyCode: "BRL"
    };
    return {
        id: variant.id,
        title,
        availableForSale: variant.stockQuantity > 0,
        selectedOptions,
        price: unitPrice,
        unitPrice,
        fardoSize: variant.fardoSize,
        fardoPrice: variant.fardoPrice ? {
            amount: Number(variant.fardoPrice).toFixed(2),
            currencyCode: "BRL"
        } : undefined,
        stockQuantity: variant.stockQuantity
    };
}
function reshapeProduct(product) {
    const variants = product.variants.map(reshapeVariant);
    const unitPrices = product.variants.map((v)=>Number(v.unitPrice));
    const optionsMap = new Map();
    for (const variant of product.variants){
        for (const [name, value] of Object.entries(variant.attributes || {})){
            if (!optionsMap.has(name)) optionsMap.set(name, new Set());
            optionsMap.get(name).add(value);
        }
    }
    const options = Array.from(optionsMap.entries()).map(([name, values])=>({
            id: name,
            name,
            values: Array.from(values)
        }));
    const image = product.imageUrl ? {
        url: product.imageUrl,
        altText: product.name,
        width: 800,
        height: 800
    } : PLACEHOLDER_IMAGE;
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
                amount: Math.min(...unitPrices).toFixed(2),
                currencyCode: "BRL"
            },
            maxVariantPrice: {
                amount: Math.max(...unitPrices).toFixed(2),
                currencyCode: "BRL"
            }
        },
        variants,
        featuredImage: image,
        images: [
            image
        ],
        seo: {
            title: product.name,
            description: product.description || ""
        },
        tags: product.category?.name ? [
            product.category.name
        ] : [],
        updatedAt: product.updatedAt
    };
}
async function apiFetch(path, revalidate = 60) {
    const res = await fetch(`${API_URL}${path}`, {
        next: {
            revalidate
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
    const target = collection.trim().toLowerCase();
    return products.filter((p)=>p.tags.some((tag)=>tag.trim().toLowerCase() === target));
}
async function getCollections() {
    const categories = await apiFetch("/categories");
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
                handle: category.name,
                title: category.name,
                description: category.name,
                seo: {
                    title: category.name,
                    description: category.name
                },
                path: `/search/${category.name}`,
                updatedAt: new Date().toISOString()
            }))
    ];
}
async function getCollection(handle) {
    const collections = await getCollections();
    const target = handle.trim().toLowerCase();
    return collections.find((c)=>c.handle.trim().toLowerCase() === target);
}
async function getMenu(_handle) {
    return [];
}
async function getPage(_handle) {
    return undefined;
}
async function getPages() {
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
async function createOrder(items) {
    const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items
        })
    });
    if (!res.ok) {
        throw new Error(`Erro ao criar pedido: ${res.status}`);
    }
    return res.json();
}
}),
"[project]/app/search/[collection]/opengraph-image.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])(params.collection);
    const title = collection?.seo?.title || collection?.title;
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
        title
    });
}
}),
"[project]/app/search/[collection]/opengraph-image--metadata.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$search$2f5b$collection$5d2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/search/[collection]/opengraph-image.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$lib$2f$metadata$2f$get$2d$metadata$2d$route$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/lib/metadata/get-metadata-route.js [app-rsc] (ecmascript)");
;
;
const imageModule = {};
async function __TURBOPACK__default__export__(props) {
    const { __metadata_id__: _, ...params } = await props.params;
    const imageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$lib$2f$metadata$2f$get$2d$metadata$2d$route$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fillMetadataSegment"])("/search/[collection]", params, "opengraph-image");
    function getImageMetadata(imageMetadata, idParam) {
        const data = {
            alt: imageMetadata.alt,
            type: imageMetadata.contentType || 'image/png',
            url: imageUrl + (idParam ? '/' + idParam : '') + "?3cedd628f8cb417b"
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

//# sourceMappingURL=_fd024ff3._.js.map