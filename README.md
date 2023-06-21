
# OpenAI Agent Framework 🤖

Built in TypeScript, the openai-agent package is designed to make your life easier and your code cleaner. You can build agents that interact in a chat-like manner, perform tasks, and integrate real-world tooling - all by intuitively exposing your NodeJS functions to OpenAI GPT Functions backend - and this package will abstract most of it using easy to use function decorators. 

With this package, you can easily create an agent to set a goal, and give a bunch of tools (functions) for the agent to solve the problem autonomously. After each step, the result is passed back to GPT via OpenAI Functions and GPT will decide the next function to invoke, including its parameters 

- [Tutorial](https://dev.to/etherlegend/create-ai-agents-and-tools-using-gpt-in-nodejs-4jfe)
- [Checkout the github repo](https://github.com/etherlegend/openai-agent)
- [Ask questions in twitter](https://twitter.com/etherlegend)
- [Read about Function APIs here if you are not aware about it](https://openai.com/blog/function-calling-and-other-api-updates?ref=upstract.com) - how ever, specific knowledge of OpenAI API/structure is not required to use this package.



## Getting Started 🚀

First, ensure that you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. This package is built using TypeScript, so you might also want to have the TypeScript compiler installed globally. You can install it using npm:

```bash
npm install -g typescript
```

To install the OpenAI Agent package, run the following command:

```bash
npm install openai-agent
```


## Setup 🛠️

To interact with OpenAI's GPT Functions and creating agents, you'll need an OpenAI API key and the model ID you want to use. To provide these details, create a `.env` file in the root of your project:

```
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo-0613
SERPAPI_API_KEY=your_serp_key 
```

SERPAPI_API_KEY is optional and required only if you use the InternetTools

You'll need to replace `your_openai_api_key` and `your_serp_key` with your actual OpenAI API key and the SERP key



## Building an Agent 🤖

Creating an agent is as simple as instantiating the `OpenAIAgent` class. Here's a basic example:

```ts
import { OpenAIAgent } from 'openai-agent';

const myAgent = new OpenAIAgent(myApiKey, myModel);
```

Now your agent is ready to go!



## Creating Custom Functions 🔧

The real power of OpenAIAgent Framework comes from its ability to call predefined functions using `OpenAIFunction` decorator. This lets you create highly interactive and versatile agents.

Here's an example of a function that searches the Internet:

```ts
import { OpenAIFunction } from 'openai-agent';

class MyFunctions {
  @OpenAIFunction(
    "Searches the internet using SerpApi to get search results",
    {
      query: {
        type: "string",
        description: "The search query",
        required: true,
      },
    }
  )
  async searchInternet(query: string): Promise<string> {
    // Your search implementation here...
  }
}
```



## Example Usage 📝

Once you've set up your agent and functions, you can put them together like this:

```ts
import { OpenAIAgent } from 'openai-agent';

// Initialize your OpenAI Agent
const myAgent = new OpenAIAgent(myApiKey, myModel);


// Provide your functions to the agent
const result = await myAgent.runAgent(
  "search the internet for 'best AI tools'",
  [new MyFunctions()]
);

console.log(result.content);
```


## Crazier Example Usages 👩‍💻

Here are some more examples of how you can use this to create agents with few example function packages:

### Agent that can use your Terminal 💻

```typescript
const agent1 = new OpenAIAgent(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL);
const osInfoResponse = await agent1.runAgent(
    [{ role: "user", content: "get my os info and write a poem about it" }],  
    [new TerminalFunctions()],5
);
console.log(osInfoResponse?.content);
```

### Agent that can Search the Web 🌐

```typescript
const agent2= new OpenAIAgent(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL);
const internetSearchResponse = await agent2.runAgent(
    [{ role: "user", content: 'search internet for latest news on OpenAI functions and get me the titles & links to top 5 articles' }],  
    [new InternetFunctions()], 10
);
console.log(internetSearchResponse?.content);
```

### Agent that can use your Terminal to do what you ask 🛠

```typescript
const agent3= new OpenAIAgent(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL);
const taskResponse = await agent3.runAgent(
    [{ role: "user", content: 'you are an expert ai assistant. Ask the user to give you inputs and do what she/he asks for, and do this in a loop, till he types exit' }],  
    [new TerminalFunctions()], 10
);
console.log(taskResponse?.content);
```

These are just a few examples of what you can do with the OpenAI Agent package! Dive in and explore, and let the AI revolution begin.

