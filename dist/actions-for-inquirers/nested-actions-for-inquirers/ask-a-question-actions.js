import chalk from "chalk";
function askAQuestionActions(action) {
    switch (action) {
        case "Ask a question":
            console.log(chalk.yellow("You asked a question!"));
            break;
    }
}
