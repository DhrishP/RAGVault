#!/usr/bin/env node
import { loadUsers } from "./functions/user-transactions.js";
import { loadSession, saveSession } from "./functions/session.js";
import { ensureAppDir } from "./utils/cli-helpers.js";
import { promptAuthenticatedUser } from "./inquirer-commands/ask-authenticated.js";
import { promptUnauthenticatedUser } from "./inquirer-commands/ask-unauthenticated.js";
import { handleAuthenticatedAction } from "./actions-for-inquirers/ask-authenticated-action.js";
import { handleUnauthenticatedAction } from "./actions-for-inquirers/ask-unauthenticated-action.js";
import cfonts from "cfonts";
export async function mainInq() {
    await ensureAppDir();
    const users = await loadUsers();
    let session = await loadSession();
    let currentUser = session.currentUser;
    cfonts.say("RAGVAULT!", {
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
        if (!currentUser) {
            const action = await promptUnauthenticatedUser();
            currentUser = await handleUnauthenticatedAction(action, users, session);
            if (currentUser) {
                session.currentUser = currentUser;
                await saveSession(session);
            }
        }
        else if (!users[currentUser].collectionName) {
            console.log("You need to set up your collection before you can use Ragvault.");
            currentUser = null;
        }
        else {
            const action = await promptAuthenticatedUser(currentUser);
            await handleAuthenticatedAction(action, currentUser, session);
            if (!session.currentUser)
                currentUser = null;
        }
    }
}
mainInq();
