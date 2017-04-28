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
    // await browser.waitForExist('#kr-shield-try-to-read');
    //
    // await browser.waitUntil(() => {
    //
    //   return browser.isVisible('.kr-dialog-shadow') === false;
    // });
    //
    // await browser.waitUntil(() => {
    //
    //   return browser.isVisible('.kr-login-modal') === false;
    // });


    //
    // let username = browser.element('#kr-shield-username');
    // let password = browser.element('#kr-shield-password');
    // let submit = browser.element('#kr-shield-submit');
    // //
    // username.setValue('18511878513');
    // password.setValue('108817');
    //
    // await password.waitForValue('108817');

    await browser.setValue('#kr-shield-username', '18511878513');
    //
    await browser.setValue('#kr-shield-password', '108817');
    //
    await browser.waitForValue('#kr-shield-password', '108817');
    await browser.waitForValue('#kr-shield-password', '18511878513');


    // submit.click();

    await browser.click('#kr-shield-submit');

    // await browser.click('#kr-shield-try-to-read');


    // let value = await browser.getValue('#kr-shield-password');
    // console.log(value);

    await browser.waitUntil(() => {
      let url = browser.getUrl();
      console.log(url, url.indexOf(pageUrl) === -1);
      return url.indexOf(pageUrl) === -1;
    });
  }
};

export default login;