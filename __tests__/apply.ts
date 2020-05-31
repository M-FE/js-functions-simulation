import '../src/apply';      

const obj = {
   name: 'willem'
};

function thisFn() {
   return this;
}

function addFn(a: string, b: string) {
   return this.name + a + b;
}

describe('Function.Apply', () => {
   it('函数内this指向thisArg', () => {
      expect(thisFn.wapply(obj)).toEqual(obj);
   });

   it('将参数以数组的形式传入函数执行并返回结果', () => {
      expect(addFn.wapply(obj, ['aa', 'bb'])).toBe('willemaabb');
   });
});
