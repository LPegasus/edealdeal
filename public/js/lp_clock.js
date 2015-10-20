/*
Created by Pegasus Ma 2015-10-9
*/
!function () {
    function SimpleExtend(obj1, obj2) {
        var props = Object.keys(obj1);
        res = Object.create(obj1);
        for (var prop in props) {
            if (obj2[prop])
                res[prop] = obj2[prop];
        }
        return res;
    }
    var local = {},
              defaultOpts = { 'spanTime': 100, 'loopCount': NaN, callbacks: [new Function] }
    _clock = function (elm, opts) {
        this.opts = SimpleExtend(defaultOpts, opts);
        this.elm = elm;
        this.now = new Date;
        this.active = false;
        this._wait = false;
        this.loopCount = opts['loopCount'];
        this.count = 0;
        this.spanTime = opts['spanTime'];
        this.callbacks = opts.callbacks;
        this.timer = null;
        var slf = this;
        Object.defineProperty(this, 'isActive', {
            get: function () {
                return !!slf.active;
            }, enumerable: false, configurable: false
        });
        Object.defineProperty(this, 'isWait', {
            get: function () {
                return !!slf._wait;
            }, enumerable: false, configurable: false
        });
    }

    _clock.prototype = {
        'constructor': _clock,
        'start': function (delay) {
            var slf = this;
            if (this.count + 1 >= this.loopCount) {
                setTimeout(function () { slf.reset.call(slf); }, 16);
                return;
            }
            this.timer = setTimeout(function () {
                slf.active = !0;
                var i = 0, len = slf.callbacks.length;
                for (; i < len; ++i) {
                    slf.callbacks[i].call(slf);
                }
                slf.start();
                ++slf.count;
            }, delay || slf.spanTime)
        },
        'stop': function () {
            var slf = this;
            slf.timer && clearTimeout(slf.timer);
        },
        'reset': function () {
            var slf = this;
            slf.active = false;
            slf.count = 0;
        },
        wait: function (delay) {
            if (!this.active) return;
            var slf = this;
            slf._wait = !0;
            slf.stop();
            slf.start(delay);
            slf._wait = !1;
        }
    }

    if (typeof define === "function" && define.amd) define(_clock);
    else if (typeof module === "object" && module.exports) module.exports = _clock;
    this.lp_clock = _clock;
}();
