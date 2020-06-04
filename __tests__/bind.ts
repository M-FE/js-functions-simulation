import '../src/bind';

const mockObj = {
    sum: 10
};

function mockBind(a: number, b: number): number {
    return this.sum + a + b;
}

describe('Function.Bind', () => {
    it('返回一个函数', () => {
        expect(typeof mockBind.wbind(null)).toBe('function');
    });

    it('返回函数的执行环境为第一个参数', () => {
        const fn = mockBind.wbind(mockObj, 5, 1);
        expect(fn()).toBe(16);
    });

    it('绑定时和调用时都可以传入参数', () => {
        const fn = mockBind.wbind(mockObj, 5);
        expect(fn(1)).toBe(16);
    });

    it('返回的函数作为构造函数时，this指向实例', () => {
        function mock(sum) {
            this.sum = sum;
        }

        mock.prototype.name = 'Willem';
    
        const Fn = mock.wbind(mockObj);
        const fn = new (Fn as any)(11);

        expect(fn.sum).toBe(11);
        expect(fn.name).toBe('Willem');
    });
});
