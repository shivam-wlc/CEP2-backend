import config from '##/src/config/config.js';
import fetchWithError from '##/src/services/fetch.service.js';

// reference: https://services.onetcenter.org/reference/mnm/ip
async function getInterestProfilerData() {
  return await fetchWithError(`${config.onet_base_url}/ws/mnm/interestprofiler/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

/**
 * @param resource: Either results or careers
 * @param answers: String of answers
 * reference: https://services.onetcenter.org/reference/mnm/ip/ip_results
 * reference: https://services.onetcenter.org/reference/mnm/ip/ip_careers
 */
async function resultAndMatchingCareers(resource, answers) {
  const url = new URL(`${config.onet_base_url}/ws/mnm/interestprofiler/${resource}`);
  url.search = new URLSearchParams({
    answers,
  });
  return await fetchWithError(url.toString(), {
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
 * @param resource: either of three: questions, questions_30 or job_zones
 * Difference between (end - start = total items)
 * reference: https://services.onetcenter.org/reference/mnm/ip/ip_questions
 * reference: https://services.onetcenter.org/reference/mnm/ip/ip_questions_30
 * reference: https://services.onetcenter.org/reference/mnm/ip/ip_job_zones
 */
async function browseQuestionAndJobs(resource, start, end) {
  const url = new URL(`${config.onet_base_url}/ws/mnm/interestprofiler/${resource}`);
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

export { getInterestProfilerData, resultAndMatchingCareers, browseQuestionAndJobs };
