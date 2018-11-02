const { parse } = require('dotenv');
const { fatal, star } = require('signale');
const { readFileSync, existsSync } = require('fs');

function setEnvVariables(envVariables) {
  for (var key in envVariables) {
    process.env[key] = envVariables[key];
  }
}

module.exports = class ServerlessPlugin {
  constructor(serverless) {
    const stage = serverless.processedInput.options.stage;
    if (!stage) throw new Error('Dotenv plugin serverless requires --stage option');
    try {
      const stageSpecificDotenvPath = stage === 'production' || stage === 'staging' ? `.env.${stage}` : '.env.dev';
      const commonVariables = existsSync('.env.common') && parse(readFileSync('.env.common'));
      const stageSpecificVariables =
        existsSync(stageSpecificDotenvPath) && parse(readFileSync(stageSpecificDotenvPath));
      const customVariables = existsSync('.env') && parse(readFileSync('.env'));

      setEnvVariables(commonVariables);
      setEnvVariables(stageSpecificVariables);
      setEnvVariables(customVariables);

      star(`Loading ENV variables from: ${commonVariables ? '.env.common' : ''} ${stageSpecificVariables ? stageSpecificDotenvPath : ''} ${customVariables ? '.env' : ''}`);
    } catch (e) {
      fatal(`Could not load env variables!`);
      fatal(e);
    }
  }
};
