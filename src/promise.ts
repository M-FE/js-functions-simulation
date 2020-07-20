type _Resolve = (value?: any) => any;
type _Reject = (reason?: any) => any;
type Executor = (_resolve: _Resolve, _reject: _Reject) => void;
type Then = (onFullfilled?: _Resolve, onRejected?: _Reject) => WPromise;
type Catch = (onRejected?: _Reject) => WPromise;
type Finally = (onHandler?: _Resolve) => WPromise;
type ParallelPromises = (iterable: WPromise[]) => WPromise;
type Resolve = (value: any) => WPromise;
type Reject = (reason: any) => WPromise;
interface Callback {
    onFullfilled?: _Resolve;
    onRejected?: _Reject;
    nextResolve: _Resolve;
    nextReject: _Reject;
}

class WPromise {
    private static PENDING = 'PENDING';
    private static FULFILLED = 'FULFILLED';
    private static REJECTED = 'REJECTED';

    private status = WPromise.PENDING;
    private value: any;
    private reason: any;
    private callbacks: Callback[] = [];
    private executed: boolean = false;

    constructor(executor: Executor) {
        executor(this._resolve.bind(this), this._reject.bind(this));
    }

    then: Then = (onFullfilled, onRejected) => {
        return new WPromise((nextResolve, nextReject) => {
            this._handler({ onFullfilled, onRejected, nextResolve, nextReject });
        });
    }

    catch: Catch = (onRejected) => {
        return this.then(undefined, onRejected);
    }

    finally: Finally = (onHandler) => {
        return this.then(onHandler, onHandler);
    }

    static resolve: Resolve = (value) => {
        if (WPromise._isPromiseLike(value)) {
            return value;
        }

        return new WPromise((resolve) => resolve(value));
    }

    static reject: Reject = (reason) => {
        if (WPromise._isPromiseLike(reason)) {
            return reason;
        }

        return new WPromise((resolve, reject) => reject(reason));
    }

    static all: ParallelPromises = (iterable) => {
        return new WPromise((resolve, reject) => {
            const ret: any[] = [];
            let count = 0;

            Array.from(iterable).forEach((item, index) => {
                WPromise.resolve(item).then(data => {
                    ret[index] = data;
                    count++;

                    if (count === iterable.length) {
                        resolve(ret);
                    }
                }, reject);
            });
        });
    }

    static race: ParallelPromises = (iterable) => {
        return new WPromise((resolve, reject) => {
            Array.from(iterable).forEach(item => {
                WPromise.resolve(item).then(resolve, reject);
            });
        });
    }

    private static _isPromiseLike = (data: any): boolean => {
        return data instanceof WPromise || (['object', 'function'].includes(typeof data) && 'then' in data);
    }

    private _handler = (callback: Callback) => {
        if (this.status === WPromise.PENDING) {
            this.callbacks.push(callback);
            return;
        }

        const { onFullfilled, onRejected, nextResolve, nextReject } = callback;

        if (this.status === WPromise.FULFILLED) {
            const toNextValue = onFullfilled ? onFullfilled(this.value) : this.value;
            nextResolve(toNextValue);
            return;
        }

        if (this.status === WPromise.REJECTED) {
            const toNextReason = onRejected ? onRejected(this.reason) : this.reason;
            nextReject(toNextReason);
        }
    }

    private _resolve: _Resolve = (value) => {
        if (this.executed) {
            return;
        }

        this.executed = true;

        // 链式调用时，针对下一个的promise
        // then方法返回一个promise时，value则返回promise执行的结果
        if (WPromise._isPromiseLike(value)) {
            value.then(this._resolve, this._reject);
            return;
        }

        this.value = value;
        this.status = WPromise.FULFILLED;

        this.callbacks.forEach(callback => this._handler(callback));
    }

    private _reject: _Reject = (reason) => {
        if (this.executed) {
            return;
        }

        this.executed = true;

        if (WPromise._isPromiseLike(reason)) {
            reason.then(this._resolve, this._reject);
            return;
        }

        this.reason = reason;
        this.status = WPromise.REJECTED;

        this.callbacks.forEach(callback => this._handler(callback));
    }
}
