import chalk from "chalk";
import inquirer from "inquirer";
import { HeadOutCommands } from "../inquirer-commands/nested-commands/headout.js";
import { HeadOutActions } from "./nested-actions-for-inquirers/headout-actions.js";
import { SettingsCommands } from "../inquirer-commands/nested-commands/settings.js";
import { SettingsActions } from "./nested-actions-for-inquirers/settings-actions.js";
import { checkChromaDocker } from "../utils/check-chromadocker.js";
import { promptAuthenticatedUser } from "../inquirer-commands/ask-authenticated.js";
import { LocalBrainActions } from "./nested-actions-for-inquirers/localbrain-actions.js";
import { LocalBrainCommands } from "../inquirer-commands/nested-commands/localbrain.js";
import { getCollection } from "../utils/chroma-client.js";
import { GetFireworksInstance } from "../utils/ai-providers.js";
import { PromptTemplate } from "@langchain/core/prompts";
export async function handleAuthenticatedAction(action, currentUserName, session, users) {
    switch (action) {
        case "Ask a question🤔":
            const collection = await getCollection(currentUserName + "-ragvault");
            const { query } = await inquirer.prompt([
                {
                    type: "input",
                    name: "query",
                    message: "Enter your query here",
                },
            ]);
            const chunks = await collection.query({
                queryTexts: [query],
                nResults: 2,
            });
            const fireworks = GetFireworksInstance(users[currentUserName].fireworksKey);
            const prompt = PromptTemplate.fromTemplate("You are a helpful assistant that can answer questions and help with tasks. You are given a question and a list of documents. You need to answer the question based on the given chunks of data. The chunks of data are: {context}. The question is: {question}.Do not recall that you are using chunks of data to answer the question. Talk like you are a human.");
            if (fireworks) {
                try {
                    // console.log(chunks.documents.join("\n"));
                    const chain = prompt.pipe(fireworks);
                    const response = await chain.invoke({
                        context: chunks.documents.join(","),
                        question: query,
                    });
                    console.log(response.content);
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                console.log(chalk.red("Fireworks API key is not set. Please set your Fireworks API key and try again."));
            }
            const AskAgainAction = await promptAuthenticatedUser(currentUserName);
            await handleAuthenticatedAction(AskAgainAction, currentUserName, session, users);
        case "Add data to your local brain🧠":
            const isChromaDockerRunning = await checkChromaDocker();
            if (isChromaDockerRunning) {
                const action = await LocalBrainCommands();
                await LocalBrainActions(action, currentUserName, users, session);
            }
            else {
                console.log(chalk.red("ChromaDB Docker is not running. Please start ChromaDB Docker and try again."));
                const AskAgainAction = await promptAuthenticatedUser(currentUserName);
                await handleAuthenticatedAction(AskAgainAction, currentUserName, session, users);
            }
        case "Clear CLI🧹":
            console.clear();
            const newAction = await promptAuthenticatedUser(currentUserName);
            await handleAuthenticatedAction(newAction, currentUserName, session, users);
            break;
        case "Settings":
            const settingsAction = await SettingsCommands();
            await SettingsActions(settingsAction, session, currentUserName, users);
            break;
        case "Head Out👋":
            const headOutAction = await HeadOutCommands();
            await HeadOutActions(headOutAction, session, currentUserName, users);
    }
}
