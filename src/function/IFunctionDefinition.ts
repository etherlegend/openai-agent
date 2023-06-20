export interface IFunctionDefinition {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: { [key: string]: { type: string, required?: boolean, enum?: string[] } };
        required: string[];
    };
    returns: { type: string };
}
