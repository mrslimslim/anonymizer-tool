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
declare class Anonymizer {
    private originalInput;
    private rules;
    private anonymizedInput;
    private replacements;
    private typeMaps;
    constructor({ input, rules }: Options);
    private defaultRules;
    private mergeRules;
    private getTypeMap;
    getTypeMaps(): Map<string, Map<string, string>>;
    parseObject(val: StructData): StructData;
    parseString(val: string): string;
    private restoreFromString;
    private restoreFromStructData;
    private anonymize;
    getAnonymized(): string;
    decode: (anonymized: string) => string;
}
export default Anonymizer;
