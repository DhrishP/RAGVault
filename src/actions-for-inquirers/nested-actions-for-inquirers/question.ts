import inquirer from "inquirer";
import { LLM, Session, UserStore } from "../../types/index.js";
import { getCollection } from "../../utils/chroma-client.js";
import { saveUsers } from "../../utils/user-transactions.js";

import { SettingsCommands } from "../../inquirer-commands/nested-commands/settings.js";
import { SettingsActions } from "./settings-actions.js";
import { answerQuestionOpenAI } from "../../helpers/gpt.js";
import { answerQuestionClaude } from "../../helpers/claude.js";
import { saveConversationHistory } from "../../helpers/history.js";
import { answerQuestionGemini } from "../../helpers/gemini.js";
import { answerQuestionOllama, getOllamaModels, isOllamaRunning } from "../../helpers/ollama.js";
import { promptAuthenticatedUser } from "../../inquirer-commands/ask-authenticated.js";
import { handleAuthenticatedAction } from "../ask-authenticated-action.js";
import chalk from "chalk";


export const QuestionActions = async (
  action: string,
  username: string,
  users: UserStore,
  session: Session
) => {
  switch (action) {
    case "Using Local LLM":
      try {
        let conversationHistory: { question: string; response: string }[] = [];
        let continueAsking = true;
        
        // Ensure Ollama is running
        if (!(await isOllamaRunning())) {
           console.log(chalk.red("Ollama is not running. Please start Ollama first."));
           break;
        }

        let selectedModel = users[username].ollamaModel;

        if (!selectedModel) {
            console.log("No Local LLM model selected. Checking available models...");
            const models = await getOllamaModels();
            if (models.length === 0) {
                 console.log(chalk.red("No Ollama models found. Please make sure Ollama is running and you have pulled at least one model (e.g., 'ollama pull llama3')."));
                 break;
            }
            const { model } = await inquirer.prompt([
                {
                    type: "list",
                    name: "model",
                    message: "Select a Local LLM model:",
                    choices: models
                }
            ]);
            selectedModel = model;
            users[username].ollamaModel = selectedModel;
            await saveUsers(users);
        }

        while (continueAsking) {
          const { question }: { question: string } = await inquirer.prompt([
            {
              type: "input",
              name: "question",
              message:
                conversationHistory.length === 0
                  ? "What question would you like to ask?"
                  : "Ask a follow-up question (or type 'exit' to end):",
            },
          ]);

          if (question.toLowerCase() === "exit") {
            continueAsking = false;
            break;
          }

          const collection = await getCollection(username + "-ragvault");
          const historyString = conversationHistory
            .map((h) => `Question: ${h.question}\nAnswer: ${h.response}`)
            .join("\n\n");
          const chunks: { documents: (string | null)[][] } =
            await collection.query({
              queryTexts: [historyString, question],
              nResults: 2,
            });

          const context = chunks.documents
            .flat()
            .filter((doc) => doc !== null)
            .join("\n");
          
          console.log(chalk.cyan("\nThinking...\n"));
          if (!selectedModel) {
             // This fallback should rarely be hit if the logic above works, 
             // but handle it just in case the file was edited or state is weird.
             const models = await getOllamaModels();
             if (models.length > 0) {
                const { model } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "model",
                        message: "Select a Local LLM model:",
                        choices: models
                    }
                ]);
                selectedModel = model;
                users[username].ollamaModel = selectedModel;
                await saveUsers(users);
             } else {
                console.error("No model selected and no models available.");
                break;
             }
          }
          
          if (selectedModel) {
              const response = await answerQuestionOllama(selectedModel, question, context, conversationHistory);
              console.log("\n" + response + "\n");

              conversationHistory.push({
                question,
                response,
              });

              const { continue: shouldContinue } = await inquirer.prompt<{
                continue: boolean;
              }>([
                {
                  type: "confirm",
                  name: "continue",
                  message: "Would you like to ask a follow-up question?",
                  default: true,
                },
              ]);
              continueAsking = shouldContinue;
          }
        }

        if (conversationHistory.length > 0) {
          await saveConversationHistory(conversationHistory, username);

          console.log("\nConversation History:");
          conversationHistory.forEach((entry, index) => {
            console.log(`\n--- Question ${index + 1} ---`);
            console.log(`Q: ${entry.question}`);
            console.log(`A: ${entry.response}`);
          });
        }
      } catch (error) {
        console.error("\nSomething went wrong\n", error);
      }
      break;
    case "Using Remote LLM":
      try {
        const sessionLLM = session.answerLLM;
        if (!sessionLLM) {
          console.log("No remote LLM selected. Please select one in the settings.");
          const action = await SettingsCommands();
          await SettingsActions(action, session, username, users);
          return;
        }

        let conversationHistory: { question: string; response: string }[] = [];
        let continueAsking = true;

        while (continueAsking) {
          const { question }: { question: string } = await inquirer.prompt([
            {
              type: "input",
              name: "question",
              message:
                conversationHistory.length === 0
                  ? "What question would you like to ask?"
                  : "Ask a follow-up/similar question (or type 'exit' to end):",
            },
          ]);

          if (question.toLowerCase() === "exit") {
            continueAsking = false;
            break;
          }

          let response: string | undefined;

          switch (sessionLLM) {
            case LLM.OPENAI:
              if (!users[username].openAIKey) {
                console.log("OpenAI key not found");
                const { openAIKey } = await inquirer.prompt<{
                  openAIKey: string;
                }>([
                  {
                    type: "input",
                    name: "openAIKey",
                    message: "Enter your OpenAI API key",
                  },
                ]);
                users[username].openAIKey = openAIKey;
                await saveUsers(users);
              }
              response = await answerQuestionOpenAI(
                users[username].openAIKey!,
                username,
                question,
                conversationHistory
              );
              break;
            case LLM.CLAUDE:
              if (!users[username].claudeKey) {
                console.log("Claude key not found");
                const { claudeKey } = await inquirer.prompt<{
                  claudeKey: string;
                }>([
                  {
                    type: "input",
                    name: "claudeKey",
                    message: "Enter your Claude API key",
                  },
                ]);
                users[username].claudeKey = claudeKey;
                await saveUsers(users);
              }
              response = await answerQuestionClaude(
                users[username].claudeKey!,
                username,
                question,
                conversationHistory
              );
              break;
            case LLM.GEMINI:
              if (!users[username].geminiKey) {
                console.log("Gemini key not found");
                const { geminiKey } = await inquirer.prompt<{
                  geminiKey: string;
                }>([
                  {
                    type: "input",
                    name: "geminiKey",
                    message: "Enter your Gemini API key",
                  },
                ]);
                users[username].geminiKey = geminiKey;
                await saveUsers(users);
              }
              response = await answerQuestionGemini(
                users[username].geminiKey!,
                username,
                question,
                conversationHistory
              );
              break;
            default:
              console.log("Invalid LLM selected.");
              continue;
          }

          if (response) {
            conversationHistory.push({
              question: question,
              response: response,
            });

            const { nextAction } = await inquirer.prompt([
              {
                type: "list",
                name: "nextAction",
                message: "What would you like to do next?",
                choices: [
                  "Ask a follow-up question",
                  "Ask a similar question",
                  "Finish conversation and checkout",
                ],
              },
            ]);

            if (nextAction === "Finish conversation and checkout") {
              continueAsking = false;
            }
          } else {
            console.log("Did not get a response from the LLM.");
          }
        }

        if (conversationHistory.length > 0) {
          await saveConversationHistory(conversationHistory, username);

          console.log("\nConversation History:");
          conversationHistory.forEach((entry, index) => {
            console.log(`\n--- Question ${index + 1} ---`);
            console.log(`Q: ${entry.question}`);
            console.log(`A: ${entry.response}`);
          });
        }
      } catch (error) {
        console.error(
          "\nSomething went wrong with remote LLM questioning.\n",
          error
        );
      }
      break;
    case "Back":
      const newAction = await promptAuthenticatedUser(username);
      await handleAuthenticatedAction(newAction, username, session, users);
      break;
  }
};
