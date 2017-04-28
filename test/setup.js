import chai from 'chai'
import chaiString from 'chai-string'
import chaiThings from 'chai-things'
import chaiAsPromised from 'chai-as-promised'

import conf from '../conf/index';
global.conf = conf;



/**
 * setup chai
 */
chai.should();
chai.use(chaiString);
chai.use(chaiThings);
chai.use(chaiAsPromised);
global.assert = chai.assert;
global.expect = chai.expect;


before(async function () {
  console.log('---------------开始测试下一个case--------------------');
})


after(async function () {
  console.log('---------------本条case结束测试--------------------');
});