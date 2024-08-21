import config from '##/src/config/config.js';
import fetchWithError from '##/src/services/fetch.service.js';

// reference: https://services.onetcenter.org/reference/mnm
async function getOnetInfo() {
  return await fetchWithError(`${config.onet_base_url}/ws/mnm/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

// get further resources
async function getONetResource(resource) {
  return await fetchWithError(`${config.onet_base_url}/ws/mnm/${resource}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

// Search careers
// reference: https://services.onetcenter.org/reference/mnm/search
async function searchCareerByKeywords(keyword, start, end) {
  return await fetchWithError(
    `${config.onet_base_url}/ws/mnm/search?keyword=${keyword}&start=${start}&end=${end}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${config.onet_token}`,
      },
    },
  );
}

export { getOnetInfo, getONetResource, searchCareerByKeywords };
