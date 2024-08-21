/* eslint-disable max-len */
import config from '##/src/config/config.js';
import fetchWithError from '##/src/services/fetch.service.js';

/**
 * career overview
 * get career details by career code
 * @param careerCode: [O*NET-SOC Code]
 * reference: https://services.onetcenter.org/reference/mnm/career#overview
 */
async function careerByCode(careerCode) {
  return await fetchWithError(`${config.onet_base_url}/ws/mnm/careers/${careerCode}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

/**
 * career overview
 * get career details by career code
 * @param careerCode: [O*NET-SOC Code]
 * @param topic: it could be any of these: knowledge, skills, abilities, personality, technology, education, job_outlook,   explore_more, where_do_they_work and report
 * reference: https://services.onetcenter.org/reference/mnm/career/knowledge
 * reference: https://services.onetcenter.org/reference/mnm/career/skills
 * reference: https://services.onetcenter.org/reference/mnm/career/abilities
 * reference: https://services.onetcenter.org/reference/mnm/career/personality
 * reference: https://services.onetcenter.org/reference/mnm/career/technology
 * reference: https://services.onetcenter.org/reference/mnm/career/education
 * reference: https://services.onetcenter.org/reference/mnm/career/outlook
 * reference: https://services.onetcenter.org/reference/mnm/career/explore
 * reference: https://services.onetcenter.org/reference/mnm/career/where
 * reference: https://services.onetcenter.org/reference/mnm/career/report
 */
async function getCareerInfo(careerCode, topic) {
  return await fetchWithError(`${config.onet_base_url}/ws/mnm/careers/${careerCode}/${topic}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${config.onet_token}`,
    },
  });
}

export { careerByCode, getCareerInfo };
