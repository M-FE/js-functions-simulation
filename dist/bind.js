"use strict";
/**
 * 使用eval，而没使用...结构是为了使用es5的语法来实现call函数
 */
Function.prototype.wbind = function (thisArg) {
    var context = thisArg || window;
    var args = [].slice.call(arguments, 1);
    var fn = this;
    var fBound = function () {
        var innerArgs = [].slice.call(arguments);
        return fn.apply(this instanceof fBound ? this : context, args.concat(innerArgs));
    };
    function fNOP() { }
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
};
