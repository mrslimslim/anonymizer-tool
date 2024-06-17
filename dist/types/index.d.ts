type Rule = {
    type: string;
    reg: RegExp;
    replace: (match: string) => string;
};
type Options = {
    input: string;
    rules: Rule[];
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
    private anonymize;
    getAnonymized(): string;
    decode: (anonymized: string) => string;
}
export default Anonymizer;
