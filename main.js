import inquirer from 'inquirer';
import chalk from 'chalk';
class Player {
    name;
    fuel = 100;
    inventory = [];
    constructor(name) {
        this.name = name;
    }
    fuelDecrease(amount = 25) {
        this.fuel = Math.max(this.fuel - amount, 0);
    }
    fuelIncrease(amount = 25) {
        this.fuel = Math.min(this.fuel + amount, 100);
    }
    getFuel() {
        return this.fuel;
    }
    addItem(item) {
        this.inventory.push(item);
    }
    useItem(item) {
        const itemIndex = this.inventory.indexOf(item);
        if (itemIndex >= 0) {
            this.inventory.splice(itemIndex, 1);
            return true;
        }
        return false;
    }
    getInventory() {
        return this.inventory;
    }
}
class Opponent {
    name;
    fuel = 100;
    constructor(name) {
        this.name = name;
    }
    fuelDecrease(amount = 25) {
        this.fuel = Math.max(this.fuel - amount, 0);
    }
}
async function main() {
    const playerData = await inquirer.prompt([{
            type: "input",
            name: "name",
            message: "Enter your name:"
        }]);
    const playerName = playerData.name;
    const player = new Player(playerName);
    const opponentData = await inquirer.prompt([{
            type: "list",
            name: "select",
            message: "Pick an opponent to fight",
            choices: [
                { name: "Toji", value: "Toji" },
                { name: "Sukuna", value: "Sukuna" },
                { name: "Geto", value: "Geto" }
            ]
        }]);
    const newOpponent = new Opponent(opponentData.select);
    let opponentColor = 'white';
    switch (opponentData.select) {
        case 'Toji':
            opponentColor = 'magenta';
            break;
        case 'Sukuna':
            opponentColor = 'red';
            break;
        case 'Geto':
            opponentColor = 'blueBright';
            break;
    }
    console.log(`${chalk.bold.white(playerName)} VS ${chalk.bold[opponentColor](newOpponent.name)}`);
    while (player.getFuel() > 0 && newOpponent.fuel > 0) {
        console.log(`\n${chalk.bold.white(playerName)}'s fuel: ${chalk.green(player.getFuel())}`);
        console.log(`${chalk.bold[opponentColor](newOpponent.name)}'s fuel: ${chalk.red(newOpponent.fuel)}`);
        console.log(`${chalk.yellow('Inventory:')} ${player.getInventory().join(', ') || 'None'}`);
        const actionData = await inquirer.prompt([{
                type: "list",
                name: "action",
                message: "Select your action:",
                choices: [
                    { name: "Attack", value: "attack" },
                    { name: "Heal", value: "heal" },
                    { name: "Use Potion", value: "usePotion" },
                    { name: "Run", value: "run" }
                ]
            }]);
        switch (actionData.action) {
            case "attack":
                console.log(chalk.red("You attack the opponent!"));
                player.fuelDecrease();
                newOpponent.fuelDecrease();
                break;
            case "heal":
                console.log(chalk.green("You heal yourself!"));
                player.fuelIncrease();
                break;
            case "usePotion":
                if (player.useItem('Potion')) {
                    console.log(chalk.green("You used a Potion!"));
                    player.fuelIncrease(50); // Increase fuel by 50 when using a potion
                }
                else {
                    console.log(chalk.red("No Potions left!"));
                }
                break;
            case "run":
                console.log(chalk.redBright("You run away!"));
                return;
        }
        if (Math.random() > 0.5 && newOpponent.fuel > 0) {
            console.log(chalk.red(`\n${newOpponent.name} attacks you!`));
            player.fuelDecrease();
        }
        if (Math.random() > 0.8) {
            console.log(chalk.blue(`\nYou found a Potion!`));
            player.addItem('Potion');
        }
    }
    if (player.getFuel() <= 0) {
        console.log(chalk.redBright("\nYou have been defeated! Game over."));
    }
    else if (newOpponent.fuel <= 0) {
        console.log(chalk.greenBright("\nYou have defeated the opponent! You win!"));
    }
}
main();
