exports.dumbcache = function (callback, ttl) {
    var lastCalled = null;
    var cachedValue = null;
    
    function now() {
        return Math.floor(new Date().getTime() / 1000);
    }
    
    return function () {
        if (lastCalled + ttl < now()) {
            lastCalled = now();
            cachedValue = callback();
        }
        
        return cachedValue;
    };
};