import XHJsonApi from '../../src/xhjsonapi';

const baseURI = 'http://localhost:8080/app';
const rpcPath = '/api';

describe('XHJsonApi', () => {

  // 测试调用 api
  describe('调用 foo.bar() 方法成功时', () => {

    let api = new XHJsonApi({
      baseURI: baseURI,
      rpcPath: rpcPath,
      methods: [
        {
          name: 'foo',
          methods: ['bar'],
        },
      ],
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    sinon.stub(api, 'post').returnsPromise().resolves({
      jsonrpc: '2.0',
      id: 1,
      result: 'bar',
    });

    it('将成功调用 post', () => {
      api.foo.bar('foo');

      expect(api.post.calledWithMatch(rpcPath,
        {
          credentials: 'include',
          body: '{"jsonrpc":"2.0","method":"foo.bar","id":1,"params":["foo"]}',
        }
      ), '调用参数和预期一致').to.be.ok;
    });

    it('将成功获取返回值', () => {
      api.foo.bar('foo').then((result) => {
        expect(result).to.equal('bar');
      });
    });
  });

  describe('设置 remoteName 参数时', () => {

    let api = new XHJsonApi({
      baseURI: baseURI,
      rpcPath: rpcPath,
      methods: [
        {
          name: 'foo',
          methods: ['bar'],
        },
        {
          name: 'other',
          remoteName: 'otherRemoteSetedName',
          methods: ['foo', 'bar'],
        },
      ],
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    it('应正确设置模块名', () => {
      expect(api.otherRemoteSetedName).to.be.undefined;
      expect(api.other).to.not.be.undefined;
      expect(api.foo).to.not.be.undefined;
    });

    it('应发送 remoteName', () => {

      sinon.stub(api, 'post').returnsPromise().resolves({
        jsonrpc: '2.0',
        id: 1,
        result: 'bar',
      });

      api.other.bar('foo');
      expect(api.post.calledWithMatch(rpcPath,
        {
          credentials: 'include',
          body: '{"jsonrpc":"2.0","method":"otherRemoteSetedName.bar","id":1,"params":["foo"]}',
        }
      ), '调用提供的远程模块名和预期一致').to.be.ok;

    });

  });

});
