import config from '##/src/config/config.js';
import fetchWithError from '##/src/services/fetch.service.js';

// reference: https://services.onetcenter.org/reference/mnm/browse
async function browseIndustry() {
  return await fetchWithError(`${config.onet_base_url}/ws/mnm/browse/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

/**
 * @params code: code of industry
 * @params start: starting item (it's like pagination)
 * @params end: ending item
 * Difference between (end - start = total items)
 * reference: https://services.onetcenter.org/reference/mnm/browse#industries
 */
async function browseIndustryCareers(code, start, end) {
  return await fetchWithError(
    `${config.onet_base_url}/ws/mnm/browse/${code}?start=${start}&end=${end}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${config.onet_token}`,
      },
    },
  );
}

export { browseIndustry, browseIndustryCareers };
