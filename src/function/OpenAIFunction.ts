import 'reflect-metadata';

interface Param {
    type: string;
    enum?: any[];
    required?: boolean;
    description?: string;
}

export  function OpenAIFunction(description: string, paramsMetadata: { [key: string]: Param }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const parameters: any = {
            type: "object",
            properties: {},
            required: []
        };

        for (const [paramName, paramData] of Object.entries(paramsMetadata)) {
            parameters.properties[paramName] = {
                type: paramData.type,
                description: paramData.description,
                enum: paramData.enum
            };
            if (paramData.required) {
                parameters.required.push(paramName);
            }
        }

        const returns: { type: string } = Reflect.getMetadata("design:returntype", target, propertyKey);

        const functionMetadata = {
            name: propertyKey,
            description: description,
            parameters: parameters,
            returns: returns
        };

        Reflect.defineMetadata("ai_function", functionMetadata, target, propertyKey);
    }
}
