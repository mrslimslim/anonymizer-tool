import { faker } from "@faker-js/faker";

type Rule = {
  type: string;
  reg: RegExp;
  replace: (match: string) => string;
};

type Options = {
  input: string;
  rules: Rule[];
};

type StructData = {
  [key: string | number | symbol]: any;
};

class Anonymizer {
  private originalInput: string;
  private rules: Rule[];
  private anonymizedInput: string;
  private replacements: Map<string, string> = new Map();
  private typeMaps: Map<string, Map<string, string>> = new Map(); // 用于存储不同类型数据的映射关系

  constructor({ input = "", rules = [] }: Options) {
    this.originalInput = input;

    this.rules = this.mergeRules(this.defaultRules(), rules);
    this.replacements = new Map();
    this.anonymizedInput = this.anonymize();
  }

  private defaultRules(): Rule[] {
    return [
      {
        type: "domain",
        replace: (raw) => faker.internet.domainName(),
        reg: /\b(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}\b/g,
      },
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
        type: "CVV",
        replace: (raw) => faker.finance.creditCardCVV(),
        reg: /\b\d{3,4}\b/g,
      },
    ];
  }

  private mergeRules(defaultRules: Rule[], rules: Rule[]) {
    return [...defaultRules, ...rules];
  }

  private getTypeMap(type: string): Map<string, string> {
    if (!this.typeMaps.has(type)) {
      this.typeMaps.set(type, new Map<string, string>());
    }
    return this.typeMaps.get(type)!;
  }

  public getTypeMaps(): Map<string, Map<string, string>> {
    return this.typeMaps;
  }

  public parseObject(val: StructData): StructData {
    if (typeof val !== "object") {
      throw new Error("The input data must be an object");
    }
    return this.restoreFromStructData(val);
  }

  public parseString(val: string): string {
    if (typeof val !== "string") {
      throw new Error("The input data must be a string");
    }
    return this.restoreFromString(val);
  }

  private restoreFromString(str: string): string {
    return this.decode(str);
  }

  // restore data from typeMap
  private restoreFromStructData(obj: StructData): StructData {
    const typeMaps = this.getTypeMaps();
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        this.restoreFromStructData(obj[key]);
      } else {
        for (const typeMap of typeMaps.values()) {
          if (typeMap.has(obj[key])) {
            obj[key] = typeMap.get(obj[key]);
            break;
          }
        }
      }
    }
    return obj;
  }

  private anonymize(): string {
    let replacedString = this.originalInput;

    for (const rule of this.rules) {
      const typeMap = this.getTypeMap(rule.type); // 获取当前规则类型的映射关系

      replacedString = replacedString.replace(rule.reg, (match) => {
        if (typeMap.has(match)) {
          return typeMap.get(match)!;
        } else {
          const replacement = rule.replace(match);
          typeMap.set(match, replacement);
          this.replacements.set(replacement, match);
          return replacement;
        }
      });
    }

    return replacedString;
  }

  public getAnonymized(): string {
    return this.anonymizedInput;
  }

  public decode = (anonymized: string): string => {
    // 数据还原使用typeMaps 需要考虑里面会有重复的情况
    const typeMaps = this.getTypeMaps();
    for (const typeMap of typeMaps.values()) {
      for (const [key, value] of typeMap.entries()) {
        anonymized = anonymized.replace(new RegExp(value, "g"), key);
      }
    }
    return anonymized;
  };
}

export default Anonymizer;
