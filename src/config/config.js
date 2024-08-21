async function getConfig() {
  // If no `NODE_ENV` was set, default it to 'development' as early as
  // possible for the benefit of subsequent logic.
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  const { default: config } = await import('##/src/config/env/default.js');

  return config;
}

const config = await getConfig();

export default config;
