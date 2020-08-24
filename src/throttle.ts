type ThrottleOptions = Partial<{
    leading: boolean, // 是否在开始时执行
    trailing: boolean // 是否在结尾时执行
}>;

function throttle(func: Function, wait: number = 0, options: ThrottleOptions) {
    const { leading, trailing } = options;
    let timer: NodeJS.Timeout | null;
    let previous: number = leading ? 0 : +new Date();

    const callFunc = (context: Function, args: any[]) => {
        func.apply(context, args);
        previous = +new Date();
        timer = null;
    }

    const throttled = function(this: Function, ...args: any[]) {
        const now = +new Date();
        const remaining = wait - (now - previous);

        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer);
            }

            callFunc(this, args);
        } else if (!timer && trailing) {
            timer = setTimeout(() => {
                callFunc(this, args);
            }, remaining);
        }
    }

    throttled.cancel = function() {
        timer && clearTimeout(timer);
        timer = null;
        previous = 0;
    };

    throttled.pending = function() {
        return !!timer || (+new Date() - previous <= wait);
    }

    return throttled;
}
