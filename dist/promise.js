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
                value.then(_this._resolve);
                return;
            }
            _this.value = value;
            _this.status = WPromise.FULFILLED;
            _this.callbacks.forEach(function (callback) { return _this._handler(callback); });
        };
        this._reject = function (reason) {
            if (reason instanceof WPromise) {
                reason.then(undefined, _this._reject);
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
    return WPromise;
}());
