import config from '##/src/config/config.js';
import fetchWithError from '##/src/services/fetch.service.js';

async function getTopUniversity(records) {
  return await fetchWithError(
    `${config.zyla_base_url}/1459/get+top+of+universities?number_of_records=${records}`,
    {
      method: 'GET',
      headers: {
        // Accept: 'application/json',
        Authorization: `Bearer ${config.zyla_token}`,
      },
    },
  );
}

async function getUniversityByCountry(country) {
  return await fetchWithError(
    `${config.zyla_base_url}/1460/get+universities+by+country?country=${country}`,
    {
      method: 'GET',
      headers: {
        // Accept: 'application/json',
        Authorization: `Bearer ${config.zyla_token}`,
      },
    },
  );
}

async function getUniversityByName(name) {
  return await fetchWithError(`${config.zyla_base_url}/1461/get+university+by+name?name=${name}`, {
    method: 'GET',
    headers: {
      // Accept: 'application/json',
      Authorization: `Bearer ${config.zyla_token}`,
    },
  });
}

export { getTopUniversity, getUniversityByCountry, getUniversityByName };
