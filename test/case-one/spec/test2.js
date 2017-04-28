import login from '../../../lib/login';

describe('test2', function() {
  // 当此case需要消耗极其长的时间才能跑完全部流程的时候
  // this.timeout(1000000);
  let url = `${conf.server.main}/goods/10017`;
  before(async function() {
    // await browser.url(url);
    // console.log(1111111);
    // await login.in(browser);
  });

  it('检测商品的富文本内容', async function() {
      browser.url(url);
      let isExisting = await browser.isExisting('.textblock');
      isExisting.should.be.true;
  });

  it('我是测试失败', async function() {
    browser.url(url);
    let isExisting = await browser.isExisting('.textblock');
    isExisting.should.be.false;
  });



});