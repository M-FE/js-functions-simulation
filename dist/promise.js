"use strict";
var WPromise = /** @class */ (function () {
    function WPromise(executor) {
        var _this = this;
        this.status = WPromise.PENDING;
        this.callbacks = [];
        this.then = function (onFullfilled, onRejected) {
            return new WPromise(function (nextResolve, nextReject) {
                _this.handler({ onFullfilled: onFullfilled, onRejected: onRejected, nextResolve: nextResolve, nextReject: nextReject });
            });
        };
        this.handler = function (callback) {
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
        this.resolve = function (value) {
            // 针对下一个的promise
            // then方法返回一个promise时，value则返回promise执行的结果
            // 链式调用
            if (value instanceof WPromise) {
                return value.then(_this.value);
            }
            _this.value = value;
            _this.status = WPromise.FULFILLED;
            _this.callbacks.forEach(function (callback) { return _this.handler(callback); });
        };
        this.reject = function (reason) {
            _this.reason = reason;
            _this.status = WPromise.REJECTED;
            _this.callbacks.forEach(function (callback) { return _this.handler(callback); });
        };
        executor(this.resolve, this.reject);
    }
    WPromise.PENDING = 'PENDING';
    WPromise.FULFILLED = 'FULFILLED';
    WPromise.REJECTED = 'REJECTED';
    return WPromise;
}());
var p = new WPromise(function (resolve) {
    setTimeout(function () {
        resolve(1);
    }, 1000);
});
var p1 = p.then(function (data) {
    console.log(data);
    return new WPromise(function (resolve) { return setTimeout(function () {
        resolve(data + 10);
    }, 2000); });
});
var p2 = p.then(function (data) {
    console.log(data);
    return data + 2;
});
p1.then(function (data) {
    console.log(data);
});
