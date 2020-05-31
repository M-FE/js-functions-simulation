import '../src/call';      

const obj = {
   name: 'willem'
};

function thisFn() {
   return this;
}

function addFn(a: string, b: string) {
   return this.name + a + b;
}

describe('Function.Call', () => {
   it('函数内this指向thisArg', () => {
      expect(thisFn.wcall(obj)).toEqual(obj);
   });

   it('将参数一个个的传入函数执行并返回结果', () => {
      expect(addFn.wcall(obj, 'aa', 'bb')).toBe('willemaabb');
   });
});
