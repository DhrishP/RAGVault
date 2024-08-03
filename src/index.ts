import inquirer from "inquirer";

async function main() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?",
    },
  ]);

  console.log(`Hello, ${answers.name}!`);
}
main();
