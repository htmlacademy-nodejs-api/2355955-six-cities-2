import {Command} from './commands/command.interface.js';
import {CommandParser} from './commands/index.js';

type CommandCollection = Record<string, Command>;

export class CLIApp {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {
  }

  public registerCommands(commands: Command[]) {
    commands.forEach((command: Command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }

      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string) {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`This default command ${this.defaultCommand} does not exist`);
    }

    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]) {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArgs = parsedCommand[commandName] ?? [];

    command.execute(...commandArgs);


  }

}
