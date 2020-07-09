"use strict";
/**
 * 使用eval，而没使用...结构是为了使用es5的语法来实现call函数
 */
Function.prototype.wapply = function (thisArg, args) {
    var context = thisArg || window;
    var ret;
    context.__fn__ = this;
    if (!args || !(args instanceof Array) || args.length === 0) {
        ret = context.__fn__();
    }
    else {
        var evalArgs = args.map(function (item, idx) { return 'args[' + idx + ']'; });
        ret = eval('context.__fn__(' + evalArgs + ')');
    }
    delete context.__fn__;
    return ret;
};
