import config from '##/src/config/config.js';
import fetchWithError from '##/src/services/fetch.service.js';

/**
 * @param start: starting item (it's like pagination)
 * @param end: ending item
 * Difference between (end - start = total items)
 * reference: https://services.onetcenter.org/reference/mnm/listings/careers
 */
async function getCareers(start, end) {
  const url = new URL(`${config.onet_base_url}/ws/mnm/careers/`);
  const params = new URLSearchParams();
  if (start) {
    params.append('start', start);
  }
  if (end) {
    params.append('end', end);
  }
  url.search = params.toString();

  return await fetchWithError(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

// reference: https://services.onetcenter.org/reference/mnm/listings/bright
async function careerWithBrightOutlook() {
  return await fetchWithError(`${config.onet_base_url}/ws/mnm/bright_outlook/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

/**
 * @param start: starting item (it's like pagination)
 * @param end: ending item
 * @param categoryCode: Category code of careers with bright outlook
 * Difference between (end - start = total items)
 * reference: https://services.onetcenter.org/reference/mnm/listings/bright#careers
 */
async function browseCareerWithBrightOutlook(categoryCode, start, end) {
  const url = new URL(`${config.onet_base_url}/ws/mnm/bright_outlook/${categoryCode}`);
  const params = new URLSearchParams();
  if (start) {
    params.append('start', start);
  }
  if (end) {
    params.append('end', end);
  }
  url.search = params.toString();

  return await fetchWithError(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

/**
 * @careers with apperenticeship: true
 * @param start: starting item (it's like pagination)
 * @param end: ending item
 * Difference between (end - start = total items)
 * reference: https://services.onetcenter.org/reference/mnm/listings/appren
 */
async function careerWithApperenticeship(start, end) {
  const url = new URL(`${config.onet_base_url}/ws/mnm/apprenticeship/`);
  const params = new URLSearchParams();
  if (start) {
    params.append('start', start);
  }
  if (end) {
    params.append('end', end);
  }
  url.search = params.toString();

  return await fetchWithError(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

// reference: https://services.onetcenter.org/reference/mnm/listings/prep
async function careerSortedByJobPrepration() {
  return await fetchWithError(`${config.onet_base_url}/ws/mnm/job_preparation/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

/**
 * @param start: starting item (it's like pagination)
 * @param end: ending item
 * @param jobZone: jobZone id
 * Difference between (end - start = total items)
 * reference: https://services.onetcenter.org/reference/mnm/listings/prep#careers
 */
async function browseCareerSortedByJobPrepration(jobZone, start, end) {
  const url = new URL(`${config.onet_base_url}/ws/mnm/job_preparation/${jobZone}`);
  const params = new URLSearchParams();
  if (start) {
    params.append('start', start);
  }
  if (end) {
    params.append('end', end);
  }
  url.search = params.toString();

  return await fetchWithError(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

export {
  getCareers,
  careerWithBrightOutlook,
  browseCareerWithBrightOutlook,
  careerWithApperenticeship,
  careerSortedByJobPrepration,
  browseCareerSortedByJobPrepration,
};
