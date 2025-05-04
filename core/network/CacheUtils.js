import NodeCache from "node-cache";
import { createCache } from "node-cache-engine";

const UUID = Math.random();
if (!globalThis.__CACHE__) {
    globalThis.__CACHE__ = new NodeCache({
        stdTTL: 60,
        checkperiod: 5,
        deleteOnExpire: false
    });
    
    const CacheUtils = globalThis.__CACHE__;
    CacheUtils.setCustom = function (cacheKey, response, ttl, delKeyAfterExpired) {

        CacheUtils.set(cacheKey, response, ttl);
        if (ttl && delKeyAfterExpired) {
            setTimeout(() => {
                CacheUtils.del(cacheKey)
            }, (ttl + 5) * 1000)
        }
    }

    CacheUtils.on("set", function (key, value) {
        console.log({
            key, value
        })
    });
    CacheUtils.on("get", function (key, value) {
        console.log({
            key, value
        })
    });
}

const CacheUtils = globalThis.__CACHE__;
// let CacheUtils = new NodeCache({
//     checkperiod: 5,
//     deleteOnExpire: false
// });
// CacheUtils.UUID = UUID
// console.log(CacheUtils.UUID)



// let CacheUtils = CacheUtils || createCache()
export {
    CacheUtils
};
