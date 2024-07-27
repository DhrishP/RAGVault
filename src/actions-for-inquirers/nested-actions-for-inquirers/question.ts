import inquirer from "inquirer";
import { LLM, Session, UserStore } from "../../types/index.js";
import { getCollection } from "../../utils/chroma-client.js";
import { saveUsers } from "../../utils/user-transactions.js";

import { SettingsCommands } from "../../inquirer-commands/nested-commands/settings.js";
import { SettingsActions } from "./settings-actions.js";
import { answerQuestionOpenAI } from "../../helpers/gpt-4o.js";
import { answerQuestionClaude } from "../../helpers/claude.js";
import { answerQuestionFireworks } from "../../helpers/fireworks.js";

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
          const chunks = await collection.query({
            queryTexts: [conversationHistory.join("\n"), question],
            nResults: 2,
          });

          const response = chunks.documents.join("\n");
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
          console.log("\nConversation History:");
          conversationHistory.forEach((entry, index) => {
            console.log(`\n--- Question ${index + 1} ---`);
            console.log(`Q: ${entry.question}`);
            console.log(`A: ${entry.response}`);
          });
        }
        break;
      } catch (error) {
        console.error("\nSomething went wrong\n");
      }
    case "Using Remote LLM":
      const sessionLLM = session.answerLLM;

      const switchPass =
        sessionLLM === LLM.OPENAI
          ? "openai"
          : sessionLLM === LLM.CLAUDE
          ? "claude"
          : sessionLLM === LLM.FIREWORKS
          ? "fireworks"
          : null;

      switch (switchPass) {
        case "openai":
          if (!users[username].openAIKey) {
            console.log("OpenAI key not found");
            const { openAIKey } = await inquirer.prompt<{ openAIKey: string }>([
              {
                type: "input",
                name: "openAIKey",
                message: "Enter your OpenAI API key",
              },
            ]);
            users[username].openAIKey = openAIKey;
            await saveUsers(users);
            break;
          }
          answerQuestionOpenAI(users[username].openAIKey, username);
          break;
        case "claude":
          if (!users[username].claudeKey) {
            console.log("Claude key not found");
            break;
          }
          answerQuestionClaude(users[username].claudeKey, username);
          break;
        case "fireworks":
          if (!users[username].fireworksKey) {
            console.log("Fireworks key not found");
            break;
          }
          answerQuestionFireworks(users[username].fireworksKey, username);
          break;
        default:
          const action = await SettingsCommands();
          SettingsActions(action, session, username, users);
      }
  }
};
