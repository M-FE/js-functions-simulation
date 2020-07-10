type Resolve = (value?: any) => any;
type Reject = (reason?: any) => any;
type Executor = (_resolve: Resolve, _reject: Reject) => void;
type Then = (onFullfilled?: Resolve, onRejected?: Reject) => WPromise;
interface Callback {
    onFullfilled?: Resolve;
    onRejected?: Reject;
    nextResolve: Resolve;
    nextReject: Reject;
}

class WPromise {
    private static PENDING = 'PENDING';
    private static FULFILLED = 'FULFILLED';
    private static REJECTED = 'REJECTED';

    private status = WPromise.PENDING;
    private value: any;
    private reason: any;
    private callbacks: Callback[] = [];

    constructor(executor: Executor) {
        executor(this._resolve.bind(this), this._reject.bind(this));
    }

    then: Then = (onFullfilled, onRejected) => {
        return new WPromise((nextResolve, nextReject) => {
            this._handler({ onFullfilled, onRejected, nextResolve, nextReject });
        });
    }

    private _handler = (callback: Callback) => {
        if (this.status === WPromise.PENDING) {
            this.callbacks.push(callback);
            return;
        }

        const { onFullfilled, onRejected, nextResolve, nextReject } = callback;

        if (this.status === WPromise.FULFILLED && onFullfilled) {
            const toNextValue = onFullfilled(this.value);
            nextResolve(toNextValue);
            return;
        }

        if (this.status === WPromise.REJECTED && onRejected) {
            const toNextReason = onRejected(this.reason);
            nextReject(toNextReason);
        }
    }

    private _resolve: Resolve = (value) => {
        // 链式调用时，针对下一个的promise
        // then方法返回一个promise时，value则返回promise执行的结果
        if (value instanceof WPromise) {
            value.then(this._resolve);
            return;
        }

        this.value = value;
        this.status = WPromise.FULFILLED;

        this.callbacks.forEach(callback => this._handler(callback));
    }

    private _reject: Reject = (reason) => {
        if (reason instanceof WPromise) {
            reason.then(undefined, this._reject);
            return;
        }

        this.reason = reason;
        this.status = WPromise.REJECTED;

        this.callbacks.forEach(callback => this._handler(callback));
    }
}
