import inquirer from "inquirer";
export const LocalBrainActions = async (action) => {
    switch (action) {
        case "Add Data using Terminal":
            const { data } = await inquirer.prompt([
                {
                    type: "input",
                    name: "data",
                    message: "What data would you like to store?",
                },
            ]);
    }
};
