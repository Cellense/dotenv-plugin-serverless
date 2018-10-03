const { parse } = require('dotenv');
const { fatal, star } = require('signale');
const { readFileSync } = require('fs')

function setEnvVariables(envVariables) {
  for (var key in envVariables) {
    process.env[key] = envVariables[key]
  }
}

module.exports = class ServerlessPlugin {
  constructor(serverless) {
    const stage = serverless.processedInput.options.stage;
    if (!stage) throw new Error('Dotenv plugin serverless requires --stage option')
    try {
      const stageSpecificDotenvPath = stage === 'production' || stage === 'staging' ? `.env.${stage}` : '.env.dev';
      const commonVariables = parse(readFileSync('.env.common'));
      const stageSpecificVariables = parse(readFileSync(stageSpecificDotenvPath));
      const customVariables = parse(readFileSync('.env'));
      
      setEnvVariables(commonVariables);
      setEnvVariables(stageSpecificVariables);
      setEnvVariables(customVariables);

      star(`Loading ENV variables from .env.common, ${stageSpecificDotenvPath} and .env`);
    } catch (e) {
      fatal(`Could not load env variables!`)
      fatal(e)
    }
  }
}
