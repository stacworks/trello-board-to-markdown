import commander from 'commander';
import info from '../package.json';
import logger from './util/logger';

export function run() {
  commander.version(info.version);

  function executeCommand(options) {
    const name = options._name;
    const command = require(`./commands/${name}`);

    logger.info(`Running '${name}' command...\n`);

    command.call(options);
  }

  commander.command('convert <id>').
    description('Convert the board <id> to a Markdown document.').
    option('-f, --filename [name]', 'The name out the output file.').
    action((id, options) => {
      options.id = id;
      executeCommand(options);
    });

  commander.parse(process.argv);
}
