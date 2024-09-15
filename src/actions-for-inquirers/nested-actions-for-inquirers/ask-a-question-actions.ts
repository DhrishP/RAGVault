import chalk from "chalk";


function askAQuestionActions(action:string){
    switch(action){
        case "Ask a question":
            console.log(chalk.yellow("You asked a question!"));
            break;
    }
}
