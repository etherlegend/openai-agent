import "reflect-metadata";

import debug from "debug";
import {
	ChatCompletionRequestMessage,
	ChatCompletionResponseMessage,
	Configuration,
	OpenAIApi,
} from "openai";

const log = debug("OpenAIAgent");

interface IMessage {
	role: string;
	name?: string;
	content?: string;
}

if (process.env.DEBUG) debug.enable("OpenAIAgent");
export class OpenAIAgent {
	private model: string;
	private openai: OpenAIApi;

	constructor(apiKey?: string, model?: string) {
		const configuration = new Configuration({
			apiKey: apiKey || process.env.OPENAI_API_KEY,
		});
		this.openai = new OpenAIApi(configuration);
		this.model = model || process.env.OPENAI_MODEL || "gpt-3.5-turbo-0613";
		log("OpenAI Wrapper initialized with model:", this.model);
	}

	getAllFunctionMetadata(instance: any): any[] {
		const metadataList: any[] = [];
		for (const propertyName of Object.getOwnPropertyNames(
			Object.getPrototypeOf(instance)
		)) {
			const metadata = Reflect.getMetadata(
				"ai_function",
				instance,
				propertyName
			);
			if (metadata) {
				metadataList.push(metadata);
			}
		}
		log("Metadata:" + JSON.stringify(metadataList));
		return metadataList;
	}

	async createChatCompletion(
		messages: ChatCompletionRequestMessage[],
		functionsObjects: any[], // accept array of function objects
		function_call: "auto" = "auto"
	): Promise<ChatCompletionResponseMessage | undefined> {
		let functions: any[] = []; // prepare a list to store all functions metadata
		for (const functionsObject of functionsObjects) {
			functions = [
				...functions,
				...this.getAllFunctionMetadata(functionsObject),
			]; // add functions metadata from each object
		}
		log("Initiating chat completion with messages:", messages);
		const response = await this.openai.createChatCompletion({
			model: this.model,
			messages: messages,
			functions: functions,
			function_call: function_call,
		});
		log("Received response:", response.data.choices[0].message);
		return response.data.choices[0].message;
	}

	async runAgent(
		prompt: ChatCompletionRequestMessage[] | string,
		functionsObjects: any[], // accept array of function objects
		maxIterations: number = 5
	): Promise<ChatCompletionResponseMessage | undefined> {
		let i = 0;
		let response;
		let messages: ChatCompletionRequestMessage[] =
			typeof prompt === "string"
				? [{ role: "user", content: prompt }]
				: prompt;

		do {
			log(`Iteration: ${i}`);
			response = await this.createChatCompletion(
				messages,
				functionsObjects
			);
			if (response) {
				if (response.function_call) {
					const functionName = response.function_call.name!;
					const functionArgs = response.function_call;
					log(
						`Calling function ${functionName} with args:`,
						functionArgs
					);
					try {
						let functionResponse;
						for (const functionsObject of functionsObjects) {
							// look for the function in all provided function objects
							if (functionsObject[functionName]) {
								functionResponse = await functionsObject[
									functionName
								](
									...Object.values(
										JSON.parse(
											functionArgs.arguments || ""
										) || {}
									)
								);
								break;
							}
						}
						messages.push(response);
						messages.push({
							role: "function",
							name: functionName,
							content: functionResponse,
						});
					} catch (error: any) {
						messages.push(response);
						messages.push({
							role: "function",
							name: functionName,
							content: `Error: ${error.message}`,
						});
					}
				} else {
					messages.push(response);
				}
			}
			i++;
		} while (i < maxIterations && response && response.function_call);
		log("Final response:", response);
		return response;
	}
}
