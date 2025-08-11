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
import { promptAuthenticatedUser } from "../../inquirer-commands/ask-authenticated.js";
import { handleAuthenticatedAction } from "../ask-authenticated-action.js";
export const QuestionActions = async (
  action: string,
  username: string,
  users: UserStore,
  session: Session
) => {
  switch (action) {
    case "Using Local LLM":
      try {
        let conversationHistory = [];
        let continueAsking = true;

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
          const chunks: { documents: (string | null)[][] } =
            await collection.query({
              queryTexts: [conversationHistory.join("\n"), question],
              nResults: 2,
            });

          const response = chunks.documents
            .flat()
            .filter((doc) => doc !== null)
            .join("\n");
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
        console.error("\nSomething went wrong\n");
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
                question
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
                question
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
                question
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
