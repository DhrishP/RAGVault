import chalk from "chalk";
import { login } from "../functions/login.js";
import { register } from "../functions/register.js";
import { resetPassword } from "../functions/reset-pass.js";
export async function handleUnauthenticatedAction(action, users, session) {
    switch (action) {
        case "Login":
            return await login(users);
        case "Register":
            return await register(users);
        case "Reset Password":
            await resetPassword(users);
            return null;
        case "Exit":
        default:
            console.log(chalk.yellow("Goodbye!"));
            process.exit();
    }
}
