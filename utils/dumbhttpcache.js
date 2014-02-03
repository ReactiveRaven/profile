exports.dumbcache = function (callback, ttl) {
    var lastCalled = null;
    var fakeRes = {
        _: {
            set: [],
            send: null,
            real: null
        },
        set: function (a, b) {
            fakeRes._.set.push([a, b]);
            fakeRes._.real.set(a, b);
        },
        send: function (a) {
            fakeRes._.send = a;
            fakeRes._.real.send(a);
            lastCalled = now();
        }
    };
    
    function now() {
        return Math.floor(new Date().getTime() / 1000);
    }
    
    return function (req, res) {
        if (lastCalled + ttl < now()) {
            fakeRes._.set = [];
            fakeRes._.send = null;
            fakeRes._.real = res;
            callback(req, fakeRes);
        } else {
            for (i = 0; i < fakeRes._.set.length; i++) {
                var current = fakeRes._.set[i];
                res.set(current[0], current[1]);
            }
            res.send(fakeRes._.send);
        }
    };
};