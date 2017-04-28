import qs from 'querystring';
let login = {
  in: async function(browser, opt) {
    let pageUrl = '';
    let prepUrl = `${conf.server.passport}/pages/`;
    pageUrl = prepUrl;
    opt = opt || {};
    opt.okUrl = 'http%3A%2F%2Ftest01.36kr.com%2F';
    if (opt && opt.okUrl) {
      pageUrl = `${prepUrl}?ok_url=${opt.okUrl}`;
    }
    // pageUrl = 'http://test01.36kr.com/goods/10029';
    await browser.url(pageUrl);

    await browser.waitForExist('#kr-shield-username');
    /*
    * ......
    * ......
    * .....
    * */

    await browser.waitUntil(() => {
      let url = browser.getUrl();
      return url.indexOf('test.test.com') === 0;
    });

  }
};

export default login;