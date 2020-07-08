type Resolve = (value?: any) => any;
type Reject = (reason?: any) => any;
type Executor = (resolve: Resolve, reject: Reject) => void;
type Then = (onFullfilled: Resolve, onRejected?: Reject) => WPromise;
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
        executor(this.resolve, this.reject);
    }

    then: Then = (onFullfilled, onRejected) => {
        return new WPromise((nextResolve, nextReject) => {
            this.handler({ onFullfilled, onRejected, nextResolve, nextReject });
        });
    }

    private handler = (callback: Callback) => {
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

    private resolve: Resolve = (value) => {
        // 针对下一个的promise
        // then方法返回一个promise时，value则返回promise执行的结果
        // 链式调用
        if (value instanceof WPromise) {
            return value.then(this.value);
        }

        this.value = value;
        this.status = WPromise.FULFILLED;

        this.callbacks.forEach(callback => this.handler(callback));
    }

    private reject: Reject = (reason) => {
        this.reason = reason;
        this.status = WPromise.REJECTED;

        this.callbacks.forEach(callback => this.handler(callback));
    }
}

const p = new WPromise((resolve) => {
    setTimeout(() => {
        resolve(1);
    }, 1000);
});

const p1 = p.then((data) => {
    console.log(data);
    return new WPromise(resolve => setTimeout(() => {
        resolve(data + 10)
    }, 2000));
});

const p2 = p.then((data) => {
    console.log(data);
    return data + 2;
});

p1.then((data) => {
    console.log(111, data);
});

// const firstPromise = new Promise((resolve, reject) => {
//     console.log('first', 1);
//     resolve(1);
// });

// const secondPromise = firstPromise.then((data: any) => {
//     console.log('second: ', data + 1);
//     // return data + 1;

//     return new Promise((resolve) => {
//         resolve(data + 1);
//     });
// }, () => {});

// secondPromise.then((data: any) => {
//     console.log('third', data + 1);
//     return data + 1;
// });
