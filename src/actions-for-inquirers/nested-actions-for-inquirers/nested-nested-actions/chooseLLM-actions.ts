import { ChooseLLMCommands } from "../../../inquirer-commands/nested-commands/nested-nested-commands/chooseLLM.js";
import { SettingsCommands } from "../../../inquirer-commands/nested-commands/settings.js";
import { LLM, UserStore } from "../../../types/index.js";
import { loadSession } from "../../../utils/session.js";
import { SettingsActions } from "../settings-actions.js";

export async function ChooseLLMAction(users: UserStore, username: string) {
  const action = await ChooseLLMCommands();
  const session = await loadSession();

  switch (action) {
    case "openAI":
      session.answerLLM = LLM.OPENAI;
      break;
    case "claude":
      session.answerLLM = LLM.CLAUDE;
      break;
    case "Back":
      const action = await SettingsCommands();
      SettingsActions(action, session, username, users);
      break;
    default:
      console.log("No LLM selected. Redirecting to settings....");
  }
}
