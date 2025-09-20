type ParsedCommand = Record<string, string[]>;

export class CommandParser {
  static parse(cliArgs: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let currentCommand:string = '';

    for (const argument of cliArgs) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = [];
        currentCommand = argument;


      } else if (currentCommand && argument) {
        parsedCommand[currentCommand].push(argument);
      }
    }
    return parsedCommand;
  }
}
