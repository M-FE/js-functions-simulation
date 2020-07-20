"use strict";
var WPromise = /** @class */ (function () {
    function WPromise(executor) {
        var _this = this;
        this.status = WPromise.PENDING;
        this.callbacks = [];
        this.then = function (onFullfilled, onRejected) {
            return new WPromise(function (nextResolve, nextReject) {
                _this._handler({ onFullfilled: onFullfilled, onRejected: onRejected, nextResolve: nextResolve, nextReject: nextReject });
            });
        };
        this.catch = function (onRejected) {
            return _this.then(undefined, onRejected);
        };
        this.finally = function (onHandler) {
            return _this.then(onHandler, onHandler);
        };
        this._handler = function (callback) {
            if (_this.status === WPromise.PENDING) {
                _this.callbacks.push(callback);
                return;
            }
            var onFullfilled = callback.onFullfilled, onRejected = callback.onRejected, nextResolve = callback.nextResolve, nextReject = callback.nextReject;
            if (_this.status === WPromise.FULFILLED && onFullfilled) {
                var toNextValue = onFullfilled(_this.value);
                nextResolve(toNextValue);
                return;
            }
            if (_this.status === WPromise.REJECTED && onRejected) {
                var toNextReason = onRejected(_this.reason);
                nextReject(toNextReason);
            }
        };
        this._resolve = function (value) {
            // 链式调用时，针对下一个的promise
            // then方法返回一个promise时，value则返回promise执行的结果
            if (value instanceof WPromise) {
                value.then(_this._resolve, _this._reject);
                return;
            }
            _this.value = value;
            _this.status = WPromise.FULFILLED;
            _this.callbacks.forEach(function (callback) { return _this._handler(callback); });
        };
        this._reject = function (reason) {
            if (reason instanceof WPromise) {
                reason.then(_this._resolve, _this._reject);
                return;
            }
            _this.reason = reason;
            _this.status = WPromise.REJECTED;
            _this.callbacks.forEach(function (callback) { return _this._handler(callback); });
        };
        executor(this._resolve.bind(this), this._reject.bind(this));
    }
    WPromise.PENDING = 'PENDING';
    WPromise.FULFILLED = 'FULFILLED';
    WPromise.REJECTED = 'REJECTED';
    WPromise.all = function (iterable) {
        return new WPromise(function (resolve, reject) {
            var ret = [];
            var count = 0;
            var _loop_1 = function (i) {
                iterable[i].then(function (data) {
                    ret[i] = data;
                    count++;
                    if (count === iterable.length) {
                        resolve(ret);
                    }
                }, function (err) {
                    reject(err);
                });
            };
            for (var i = 0; i < iterable.length; i++) {
                _loop_1(i);
            }
        });
    };
    return WPromise;
}());
function fetchData(value, success, timer) {
    if (success === void 0) { success = true; }
    if (timer === void 0) { timer = 1000; }
    return new WPromise(function (resolve, reject) {
        setTimeout(function () {
            success ? resolve(value) : reject(value);
        }, timer);
    });
}
var promises = [
    fetchData('a', true, 1000),
    fetchData('c', false, 3000),
];
var timer = +new Date();
WPromise.all(promises).then(function (data) {
    console.log('success', data);
    console.log((+new Date() - timer) / 1000);
}).catch(function (err) {
    console.log('error - catch', err);
    console.log((+new Date() - timer) / 1000);
});
