module.exports = [
"[project]/lib/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_OPTION",
    ()=>DEFAULT_OPTION,
    "HIDDEN_PRODUCT_TAG",
    ()=>HIDDEN_PRODUCT_TAG,
    "SHOPIFY_GRAPHQL_API_ENDPOINT",
    ()=>SHOPIFY_GRAPHQL_API_ENDPOINT,
    "TAGS",
    ()=>TAGS,
    "defaultSort",
    ()=>defaultSort,
    "sorting",
    ()=>sorting
]);
const defaultSort = {
    title: "Relevance",
    slug: null,
    sortKey: "RELEVANCE",
    reverse: false
};
const sorting = [
    defaultSort,
    {
        title: "Trending",
        slug: "trending-desc",
        sortKey: "BEST_SELLING",
        reverse: false
    },
    {
        title: "Latest arrivals",
        slug: "latest-desc",
        sortKey: "CREATED_AT",
        reverse: true
    },
    {
        title: "Price: Low to high",
        slug: "price-asc",
        sortKey: "PRICE",
        reverse: false
    },
    {
        title: "Price: High to low",
        slug: "price-desc",
        sortKey: "PRICE",
        reverse: true
    }
];
const TAGS = {
    collections: "collections",
    products: "products",
    cart: "cart"
};
const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
const DEFAULT_OPTION = "Default Title";
const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2023-01/graphql.json";
}),
"[project]/components/cart/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"002572b034d56e691d1cde87bd360879341eb793f5":"createCartAndSetCookie","004c04554564cad2fb0f3627249c50b044c67970c6":"redirectToCheckout","6032b071feeade56f9d085e75f3561c9a4b3092fe3":"removeItem","60872d0131cce4140b46b1c98d78ca85a21b3214f1":"addItem","60bc455708204ebdf672a90daaf8a826c9393d8b30":"updateItemQuantity"},"",""] */ __turbopack_context__.s([
    "addItem",
    ()=>addItem,
    "createCartAndSetCookie",
    ()=>createCartAndSetCookie,
    "redirectToCheckout",
    ()=>redirectToCheckout,
    "removeItem",
    ()=>removeItem,
    "updateItemQuantity",
    ()=>updateItemQuantity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'lib/api'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function addItem(prevState, selectedVariantId) {
    if (!selectedVariantId) {
        return "Error adding item to cart";
    }
    try {
        await addToCart([
            {
                merchandiseId: selectedVariantId,
                quantity: 1
            }
        ]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].cart);
    } catch (e) {
        return "Error adding item to cart";
    }
}
async function removeItem(prevState, merchandiseId) {
    try {
        const cart = await getCart();
        if (!cart) {
            return "Error fetching cart";
        }
        const lineItem = cart.lines.find((line)=>line.merchandise.id === merchandiseId);
        if (lineItem && lineItem.id) {
            await removeFromCart([
                lineItem.id
            ]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].cart);
        } else {
            return "Item not found in cart";
        }
    } catch (e) {
        return "Error removing item from cart";
    }
}
async function updateItemQuantity(prevState, payload) {
    const { merchandiseId, quantity } = payload;
    try {
        const cart = await getCart();
        if (!cart) {
            return "Error fetching cart";
        }
        const lineItem = cart.lines.find((line)=>line.merchandise.id === merchandiseId);
        if (lineItem && lineItem.id) {
            if (quantity === 0) {
                await removeFromCart([
                    lineItem.id
                ]);
            } else {
                await updateCart([
                    {
                        id: lineItem.id,
                        merchandiseId,
                        quantity
                    }
                ]);
            }
        } else if (quantity > 0) {
            // If the item doesn't exist in the cart and quantity > 0, add it
            await addToCart([
                {
                    merchandiseId,
                    quantity
                }
            ]);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].cart);
    } catch (e) {
        console.error(e);
        return "Error updating item quantity";
    }
}
async function redirectToCheckout() {
    let cart = await getCart();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(cart.checkoutUrl);
}
async function createCartAndSetCookie() {
    let cart = await createCart();
    (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).set("cartId", cart.id);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    addItem,
    removeItem,
    updateItemQuantity,
    redirectToCheckout,
    createCartAndSetCookie
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addItem, "60872d0131cce4140b46b1c98d78ca85a21b3214f1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(removeItem, "6032b071feeade56f9d085e75f3561c9a4b3092fe3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateItemQuantity, "60bc455708204ebdf672a90daaf8a826c9393d8b30", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(redirectToCheckout, "004c04554564cad2fb0f3627249c50b044c67970c6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createCartAndSetCookie, "002572b034d56e691d1cde87bd360879341eb793f5", null);
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/components/cart/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/components/cart/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "002572b034d56e691d1cde87bd360879341eb793f5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCartAndSetCookie"],
    "004c04554564cad2fb0f3627249c50b044c67970c6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirectToCheckout"],
    "6032b071feeade56f9d085e75f3561c9a4b3092fe3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["removeItem"],
    "60bc455708204ebdf672a90daaf8a826c9393d8b30",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateItemQuantity"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/components/cart/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_67e6c5e6._.js.map