"use strict";
/**
 * 使用eval，而没使用...结构是为了使用es5的语法来实现call函数
 */
Function.prototype.wcall = function (thisArg) {
    var context = thisArg || window;
    context.__fn__ = this;
    var args = [];
    for (var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var ret = eval('context.__fn__(' + args + ')');
    delete context.__fn__;
    return ret;
};
