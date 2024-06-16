import { fa, faker } from "@faker-js/faker";

type Rule = {
  type: string;
  reg: RegExp;
  replace: (match: string) => string;
};

type Options = {
  input: string;
  rules: Rule[];
};

class Anonymizer {
  private originalInput: string;
  private rules: Rule[];
  private anonymizedInput: string;
  private replacements: Map<string, string> = new Map();

  constructor({ input = "", rules = [] }: Options) {
    this.originalInput = input;

    this.rules = this.mergeRules(this.defaultRules(), rules);
    this.replacements = new Map();
    this.anonymizedInput = this.anonymize();
  }

  private defaultRules(): Rule[] {
    return [
      {
        type: "email",
        replace: (raw) => faker.internet.email(),
        reg: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      },
      //   {
      //     type: "domain",
      //     replace: (raw) => faker.internet.domainName(),
      //     // 要排除前面没有协议
      //     reg: /(?<!https?:\/\/)[\w-]+\.[\w-]+\.[\w-]+\b/g,
      //   },
      {
        type: "phone",
        replace: (raw) => {
          const randomTen = Math.floor(Math.random() * 1000000000);
          return `1${randomTen.toString().padStart(9, "0")}`;
        },
        reg: /\b(\+?\d{1,3}[-\s.]?)?(\(?\d{1,4}\)?[-\s.]?)?\d{1,4}[-\s.]?\d{1,4}[-\s.]?\d{1,9}\b/g,
      },
      {
        type: "ipv4",
        replace: (raw) => faker.internet.ipv4(),
        reg: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
      },
      {
        type: "ipv6",
        replace: (raw) => faker.internet.ipv6(),
        reg: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
      },
      {
        type: "url",
        replace: (raw) => faker.internet.url(),
        reg: /\bhttps?:\/\/[^\s]+/g,
      },
      {
        type: "CVV",
        replace: (raw) => faker.finance.creditCardCVV(),
        reg: /\b\d{3,4}\b/g,
      },
    ];
  }

  private mergeRules(defaultRules: Rule[], rules: Rule[]) {
    return [...defaultRules, ...rules];
  }

  private anonymize(): string {
    let replacedString = this.originalInput;
    for (const rule of this.rules) {
      replacedString = replacedString.replace(rule.reg, (match) => {
        const replacement = rule.replace(match);
        this.replacements.set(replacement, match);
        return replacement;
      });
    }
    return replacedString;
  }

  public getAnonymized(): string {
    return this.anonymizedInput;
  }

  public decode = (anonymized: string): string => {
    let decodedString = anonymized;
    for (const [replacement, original] of this.replacements) {
      decodedString = decodedString.replace(replacement, original);
    }
    return decodedString;
  };
}

export default Anonymizer;
