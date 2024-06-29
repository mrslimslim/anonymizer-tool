const Anonymizer = require('./dist/data-anonymizer').default
const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: '*************', // This is the default and can be omitted
  baseURL: '*********************'// This is the default and can be omitted
});

async function main() {
  const input = '大家好，很高兴参加本次比赛，我的github地址是github.com,我的名字叫JameBruce,我的github地址是：github.com/mrslimslim, 我的电话号码是13550004893或者18550004835,以及13550004893,我的邮箱地址是jamebruce89@gmail.com，我的博客地址是https://mmblog.com。';
  const rules = [{
    type: 'name',
    reg: /JameBruce/g,
    replace() {
      return 'John Doe'
    }
  }]; // 使用默认规则
  const anonymizer = new Anonymizer({
    input,
    rules
  });

  const anonymized = anonymizer.getAnonymized();

  const messages = [{
    "role": "user", "content": `
请优化如下的表述：
${anonymized}
      `}];

  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: messages,
  // });
  //   console.log(response.choices[0].message);
  //   console.log(anonymizer.parseString(response.choices[0].message.content));

  //   console.log('Anonymized:', anonymized);

  const typeMap = anonymizer.getTypeMaps();
  console.log('TypeMap:', typeMap);
  const a = {
    name: 'John Doe',
    phone: '13550004893',
  }

  const decoded = anonymizer.decode(anonymized);
  console.log('Decoded:', decoded);

  console.log(decoded === input); // true
}

main();