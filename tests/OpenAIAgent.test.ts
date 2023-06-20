import axios from 'axios';
import * as readline from 'readline';
import { TerminalFunctions } from '../src/tools/TerminalFunctions';
import { OpenAIAgent } from '../src/OpenAIAgent';
import { InternetFunctions } from '../src/tools/InternetFunctions';
import { ChatCompletionRequestMessage } from 'openai';
import os from "os";
import * as dotenv from "dotenv";
dotenv.config();



describe('OpenAIAgent', () => {
  
  let terminalFunctions: TerminalFunctions;
  let internetFunctions: InternetFunctions;

  beforeEach(() => {
   
    terminalFunctions = new TerminalFunctions();
    internetFunctions = new InternetFunctions();
  });

  

  it('find the current directory of the user', async () => {
    let openAIAgent = new OpenAIAgent(process.env.OPENAI_API_KEY);
    const messages:ChatCompletionRequestMessage[] = [
      { role: 'user', content: 'find the current working directory' },
    ];
    const echoResponse = await openAIAgent.runAgent(messages, [terminalFunctions], 10);
    expect(echoResponse?.content).toContain("openai-functions");
  });

  it('searches google', async () => {

    let openAIAgent = new OpenAIAgent(process.env.OPENAI_API_KEY);
    const messages:ChatCompletionRequestMessage[] = [
      { role: 'user', content: `Search google and find the companies owned by Elon Musk` },
    ];
    const fetchResponse = await openAIAgent.runAgent(messages, [internetFunctions], 10);
    expect(fetchResponse?.content).toContain("Tesla");
  }, 20000  );
});
