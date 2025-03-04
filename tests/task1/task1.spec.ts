import { expect, test } from '@playwright/test';
import axios from 'axios';

const apiUrl = 'https://api.nordvpn.com/v1/helpers/ips/insights';

//use "npx playwright test" to run all tests
//use "npx playwright test tests/task1/task1.spec.ts" to run only given test
test.describe('IPS Insights API - verification', () => {
  test('should return status 200', async () => {
    const response = await axios.get(apiUrl);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
  });

  test('should return json content', async () => {
    const response = await axios.get(apiUrl);
    expect(response.headers).not.toBeNull();
    expect(response.headers['content-type']).toContain('application/json');
  });

  test('should return response within 1000ms', async () => {
    const start = Date.now();
    await axios.get(apiUrl);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  test('should return "ip" property', async () => {
    const response = await axios.get(apiUrl);
    expect(response.data).toHaveProperty('ip');
    expect(typeof response.data.ip).toBe('string');
    expect(response.data.ip).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);

    //if response is static this assertion can be added
    expect(response.data.ip).toBe('83.22.129.90');
  });

  test('should return "country" property', async () => {
    const response = await axios.get(apiUrl);
    expect(response.data).toHaveProperty('country');
    expect(typeof response.data.country).toBe('string');

    //if response is static this assertion can be added
    expect(response.data.country).toBe('Poland');
  });

  test('should return "country_code" property', async () => {
    const response = await axios.get(apiUrl);
    expect(response.data.country_code).toMatch(/^[A-Z]{2}$/);

    //if response is static this assertion can be added
    expect(response.data.country_code).toBe('PL');
  });

  test('should return "isp_asn" property', async () => {
    const response = await axios.get(apiUrl);
    expect(response.data).toHaveProperty('isp_asn');
    expect(typeof response.data.isp_asn).toBe('number');
    expect(response.data.isp_asn).toBeGreaterThan(0);

    //if response is static this assertion can be added
    expect(response.data.isp_asn).toBe(5617);
  });

  test('should return "protected" property', async () => {
    const response = await axios.get(apiUrl);
    expect(response.data).toHaveProperty('protected');
    expect(typeof response.data.protected).toBe('boolean');

    //if response is static this assertion can be added
    expect(response.data.protected).toBeFalsy();
  });

  test('should return "latitude" and "longitude" properties', async () => {
    const response = await axios.get(apiUrl);
    expect(response.data).toHaveProperty('longitude');
    expect(response.data).toHaveProperty('latitude');
    expect(typeof response.data.longitude).toBe('number');
    expect(typeof response.data.latitude).toBe('number');
    expect(response.data.longitude).toBeGreaterThanOrEqual(-180);
    expect(response.data.longitude).toBeLessThanOrEqual(180);
    expect(response.data.latitude).toBeGreaterThanOrEqual(-90);
    expect(response.data.latitude).toBeLessThanOrEqual(90);

    //if response is static this assertion can be added
    expect(response.data.longitude).toBe(20.0168);
    expect(response.data.latitude).toBe(50.0885);
  });

  test('should return "state_code" property', async () => {
    const response = await axios.get(apiUrl);
    expect(response.data).toHaveProperty('state_code');
    expect(typeof response.data.state_code).toBe('string');
    expect(response.data.state_code).toMatch(/^\d{2}$/);

    //if response is static this assertion can be added
    expect(response.data.state_code).toBe('12');
  });

  test('should return "zip_code" property', async () => {
    const response = await axios.get(apiUrl);
    expect(response.data).toHaveProperty('zip_code');
    expect(typeof response.data.zip_code).toBe('string');
    expect(response.data.zip_code).toMatch(/^\d{2}-\d{3}$/);

    //if response is static this assertion can be added
    expect(response.data.zip_code).toBe('31-818');
  });
});
