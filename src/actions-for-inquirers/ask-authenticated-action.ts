import chalk from "chalk";
import { HeadOutCommands } from "../inquirer-commands/nested-commands/headout.js";
import { HeadOutActions } from "./nested-actions-for-inquirers/headout-actions.js";
import { SettingsCommands } from "../inquirer-commands/nested-commands/settings.js";
import { SettingsActions } from "./nested-actions-for-inquirers/settings-actions.js";
import { checkChromaDocker } from "../utils/check-chromadocker.js";
import { promptAuthenticatedUser } from "../inquirer-commands/ask-authenticated.js";
import { LocalBrainActions } from "./nested-actions-for-inquirers/localbrain-actions.js";
import { LocalBrainCommands } from "../inquirer-commands/nested-commands/localbrain.js";
import { Session, UserStore } from "../types/index.js";
import { QuestionActions } from "./nested-actions-for-inquirers/question.js";
import { AskAQuestionCommands } from "../inquirer-commands/nested-commands/question.js";


export async function handleAuthenticatedAction(
  action: string,
  currentUserName: string,
  session: Session,
  users: UserStore
) {
  switch (action) {
    case "Ask a question🤔":
      const question = await AskAQuestionCommands();
      await QuestionActions(question, currentUserName, users, session);
      // const AskAgainAction = await promptAuthenticatedUser(currentUserName);
      // await handleAuthenticatedAction(
      //   AskAgainAction,
      //   currentUserName,
      //   session,
      //   users
      // );
    case "Add data to your local brain🧠":
      const isChromaDockerRunning = await checkChromaDocker();
      if (isChromaDockerRunning) {
        const action = await LocalBrainCommands();
        await LocalBrainActions(action, currentUserName, users, session);
      } else {
        console.log(
          chalk.red(
            "ChromaDB Docker is not running. Please start ChromaDB Docker and try again."
          )
        );
        const AskAgainAction = await promptAuthenticatedUser(currentUserName);
        await handleAuthenticatedAction(
          AskAgainAction,
          currentUserName,
          session,
          users
        );
      }
    case "Clear CLI🧹":
      console.clear();
      const newAction = await promptAuthenticatedUser(currentUserName);
      await handleAuthenticatedAction(
        newAction,
        currentUserName,
        session,
        users
      );
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
