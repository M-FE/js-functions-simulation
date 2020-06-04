interface Function {
    wbind(this: Function, thisArg: any, ...argArray: any[]): Function;
}

/**
 * 使用eval，而没使用...结构是为了使用es5的语法来实现call函数
 */
Function.prototype.wbind = function(thisArg) {
    const context = thisArg || window;
    const args = [].slice.call(arguments, 1);
    const fn = this;

    const fBound = function(this: any) {
        const innerArgs = [].slice.call(arguments);

        return fn.apply(
            this instanceof fBound ? this : context, args.concat(innerArgs));
    }

    function fNOP() {}
    fNOP.prototype = this.prototype;
    fBound.prototype = new (fNOP as any)();

    return fBound;
}
