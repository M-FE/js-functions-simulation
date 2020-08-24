type ThrottleOptions = Partial<{
    leading: boolean, // 是否在开始时执行
    trailing: boolean // 是否在结尾时执行
}>;

function throttle(func: Function, wait: number = 0, options: ThrottleOptions) {
    const { leading, trailing } = options;
    let timer: NodeJS.Timeout | null;
    let previous: number = leading ? 0 : +new Date();

    const throttled = function(this: Function, ...args: any[]) {
        const now = +new Date();

        if (now - previous > wait) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            func.apply(this, args);
            previous = now;
        } else if (!timer && trailing) {
            timer = setTimeout(() => {
                func.apply(this, args);
                previous = now;
                timer = null;
            }, wait);
        }
    }

    return throttled;
}
