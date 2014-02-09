exports.dumbcache = function (callback, ttl, name) {
    var lastCalled = [];
    var cachedValue = [];
    
    if (!name) {
        name = "Unknown" + Math.round(Math.random()*1000);
    }
    
    function now() {
        return Math.floor(new Date().getTime() / 1000);
    }
    
    return function () {
        var key = JSON.stringify(arguments);
        if (!lastCalled[key] || lastCalled[key] + ttl < now()) {
            lastCalled[key] = now();
            console.log("Cache miss " + name + "(" + key + ")!");
            var oldValue = cachedValue[key];
            cachedValue[key] = callback.apply(callback, arguments);
            if (oldValue) {
                return oldValue;
            }
        }
        
        return cachedValue[key];
    };
};