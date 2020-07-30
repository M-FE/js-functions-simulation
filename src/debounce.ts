function debounce(func: Function, wait = 0, immediate = false): Function {
    let timer: NodeJS.Timeout | null;
    let result: any;

    const debounced = function (this: Function): any {
        const args = arguments;
        timer && clearTimeout(timer);

        if (immediate) {
            if (!timer) {
                result = func.apply(this, args);
            }

            setTimeout(() => {
                timer = null;
            }, wait);
        } else {
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, wait);
        }

        return result;
    }

    debounced.cancel = function () {
        timer && clearTimeout(timer);
        timer = null;
    }

    debounced.pending = function() {
        return !!timer;
    }

    return debounced;
}
