#!/usr/bin/env node
import { loadUsers, saveUsers } from "./utils/user-transactions.js";
import { loadSession, saveSession } from "./utils/session.js";
import { ensureAppDir } from "./utils/cli-helpers.js";
import { promptAuthenticatedUser } from "./inquirer-commands/ask-authenticated.js";
import { promptUnauthenticatedUser } from "./inquirer-commands/ask-unauthenticated.js";
import { handleAuthenticatedAction } from "./actions-for-inquirers/ask-authenticated-action.js";
import { handleUnauthenticatedAction } from "./actions-for-inquirers/ask-unauthenticated-action.js";
import cfonts from "cfonts";
import { checkChromaDocker } from "./utils/check-chromadocker.js";
import { generateCollectionName } from "./utils/generate-collectionName.js";
import { Session, UserStore } from "./types/index.js";

export async function mainInq(): Promise<void> {
  await ensureAppDir();

  const users: UserStore = await loadUsers();
  let session: Session = await loadSession();
  let currentUserName: string | undefined = session.currentUser?.username;
  const isChromaDBRunning = await checkChromaDocker();
  if (!isChromaDBRunning) {
    cfonts.say("Error", {
      font: "block",
      align: "left",
      colors: ["red"],
      background: "transparent",
      letterSpacing: 1,
      lineHeight: 1,
      space: true,
      maxLength: "0",
      gradient: false,
    });
    console.log(
      "Please run the docker container for ChromaDB to start on port 8000."
    );
    process.exit(1);
  }

  cfonts.say("RAGVAULT", {
    font: "block", // define the font face
    align: "left", // define text alignment
    colors: ["system"], // define all colors
    background: "transparent", // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1, // define letter spacing
    lineHeight: 1, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: "0", // define how many character can be on one line
    gradient: false, // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false, // define if this is a transition between colors directly
    rawMode: false, // define if the line breaks should be CRLF (`\r\n`) over the default LF (`\n`)
    env: "node", // define the environment cfonts is being executed in
  });

  while (true) {
    if (!currentUserName) {
      const action = await promptUnauthenticatedUser();
      const user = await handleUnauthenticatedAction(action, users, session);
      if (user) {
        session.currentUser = user;
        await saveSession(session);
        currentUserName = user.username;
      }
    } else if (!users[currentUserName].collectionName) {
      const isCollectionNameSet = users[currentUserName].collectionName;
      if (!isCollectionNameSet) {
        const collectionName = await generateCollectionName(currentUserName);
        users[currentUserName].collectionName = collectionName.name;
        await saveUsers(users);
      }
      const action = await promptAuthenticatedUser(currentUserName);
      await handleAuthenticatedAction(action, currentUserName, session, users);
      if (!session.currentUser) currentUserName = undefined;
    } else {
      const action = await promptAuthenticatedUser(currentUserName);
      await handleAuthenticatedAction(action, currentUserName, session, users);
      if (!session.currentUser) currentUserName = undefined;
    }
  }
}

mainInq();
