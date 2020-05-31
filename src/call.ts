interface Function {
    wcall(this: Function, thisArg: any, ...args: any[]): any;
}

/**
 * 使用eval，而没使用...结构是为了使用es5的语法来实现call函数
 */
Function.prototype.wcall = function (thisArg) {
    const context = thisArg || window;
    context.__fn__ = this;

    const args: any[] = [];

    for (let i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    const ret = eval('context.__fn__(' + args + ')');
    delete context.__fn__;

    return ret;
}
