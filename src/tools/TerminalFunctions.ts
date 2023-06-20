
import { ChatCompletionRequestMessage } from "openai";
import { exec } from "child_process";
import readline from 'readline';
import { writeFile } from 'fs';
import { promisify } from 'util';
import { OpenAIFunction } from '../function/OpenAIFunction';
import os from 'os';

const writeFileAsync = promisify(writeFile);
const execAsync = promisify(exec);

export class TerminalFunctions {


    @OpenAIFunction("Provides OS Information", {})
    async provideOSInfo(): Promise<string> {
        return `Platform: ${os.platform()}, Release: ${os.release()}, Arch: ${os.arch()}, CPU count: ${os.cpus().length}, Total memory: ${os.totalmem()}, Free memory: ${os.freemem()}`;
    }

    @OpenAIFunction("Runs a terminal command", {
        command: { type: 'string', description: 'The command to run', required: true }
    })
    async runCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    reject(`error: ${JSON.stringify(error)}`);
                    return;
                }
                if (stderr) {
                    console.log(stderr);
                    reject(`stderr: ${JSON.stringify(stderr)}`);
                    return;
                }
                console.log(stdout);
                resolve(stdout);
            });
        });
    }

    @OpenAIFunction("Outputs something to the console", {
        message: { type: 'string', description: 'The message to output', required: true }
    })
    async outputToConsole(message: any): Promise<string> {
        console.log(message);
        return 'Message output to console';
    }

    @OpenAIFunction("Reads a line from the console", {
        question: { type: 'string', description: 'The question to ask', required: true }
    })
    async readFromConsole(question: string): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question(question + "\n answer >> ", (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }
}