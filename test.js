const Anonymizer  = require('./dist/data-anonymizer').default

function main() {
    const input = '我的名字叫JameBruce,我的github地址是：github.com/mrslimslim, 我的电话号码是13550004893或者18550004835,我的邮箱地址是jamebruce89@gmail.com，我的博客地址是https://mmblog.com。';
    const rules = []; // 使用默认规则
    const anonymizer = new Anonymizer({
        input,
        rules
    });
    
    const anonymized = anonymizer.getAnonymized();
    console.log('Anonymized:', anonymized);
  
    const decoded = anonymizer.decode(anonymized);
    console.log('Decoded:', decoded);
  
    console.log(decoded === input); // true
  }
  
main();