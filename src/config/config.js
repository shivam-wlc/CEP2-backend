/* eslint-disable */

async function getConfig() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const { default: config } = await import('##/src/config/env/default.js');
  return config;
}

const config = await getConfig();

export default config;
