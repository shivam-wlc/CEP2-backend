import config from '##/src/config/config.js';
import fetchWithError from '##/src/services/fetch.service.js';

async function getTopUniversity() {
  return await fetchWithError(
    `${config.zyla_base_url}1459/get+top+of+universities?number_of_records=100`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${config.zyla_token}`,
      },
    },
  );
}

export { getTopUniversity };
