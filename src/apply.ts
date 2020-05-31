interface Function {
    wapply(this: Function, thisArg: any, args?: any[]): any;
}

Function.prototype.wapply = function(thisArg, args) {
    const context = thisArg || window;
    let ret;
    context.__fn__ = this;

    if (!args || !(args instanceof Array) || args.length === 0) {
        ret = context.__fn__();
    } else {
        const evalArgs = args.map((item, idx) => 'args[' + idx + ']');
        ret = eval('context.__fn__(' + evalArgs + ')');
    }

    delete context.__fn__;

    return ret;
}
