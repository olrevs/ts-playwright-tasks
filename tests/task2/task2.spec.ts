import { expect, test } from '@playwright/test';
import * as locators from '../../task2/locators/locators.json';

const landingPageUrl = 'https://nordvpn.com/offer/';
const pricingPageUrl = 'https://nordvpn.com/offer/pricing/';
const checkoutPageUrl = 'https://order.nordvpn.com/payment/';
const logInPageUrl = 'https://nordaccount.com/login/';

const pricingPageTitle = 'VPN cost? Buy VPN with Credit Card, Crypto, PayPal | NordVPN';
const checkoutPageTitle = 'Get Nord Security | Nord Checkout';
const logInPageTitle = 'Quick, easy, and secure login with Nord Account.';

//use "npx playwright test" to run all tests
//use "npx playwright test tests/task2/task2.spec.ts" to run only given test
test.describe('Critical feature - verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(landingPageUrl);

    const cookiePopup = page.getByTestId(locators.cookiesBannerLocator);
    if (await cookiePopup.isVisible()) {
      await page.locator(locators.cookiesBannerAcceptButtonLocator).click();
    }
  });

  test('should navigate from landing page to pricing page', async ({ page }) => {
    await page.locator(locators.getNordVpnButtonLocator).click();
    await expect(page).toHaveTitle(pricingPageTitle);
    await expect(page).toHaveURL(pricingPageUrl);
  });

  test('should select subscription plan and redirect to checkout page', async ({ page }) => {
    await page.locator(locators.getNordVpnButtonLocator).click();
    await expect(page).toHaveTitle(pricingPageTitle);
    await expect(page).toHaveURL(pricingPageUrl);

    await page.locator(locators.getPlusPlanLocator).nth(0).click();
    await expect(page).toHaveTitle(checkoutPageTitle);
    expect(page.url()).toContain(checkoutPageUrl);
    await expect(page.getByTestId(locators.logInButtonLocator)).toBeVisible();
  });

  test('should go though pages: checkout with "1 year" plan -> navigate back -> checkout with "1 month" plan', async ({ page }) => {
    await page.locator(locators.getNordVpnButtonLocator).click();
    await expect(page).toHaveTitle(pricingPageTitle);
    await expect(page).toHaveURL(pricingPageUrl);

    let dropdown = page.locator(locators.planDropdownLocator);
    await dropdown.selectOption({ value: '1y' });

    await page.locator(locators.getPlusPlanLocator).nth(0).click();
    expect(page.url()).toContain(checkoutPageUrl);
    await expect(page.getByTestId(locators.logInButtonLocator)).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(pricingPageUrl);

    await dropdown.selectOption({ value: '1m' });

    await page.locator(locators.getPlusPlanLocator).nth(0).click();
    expect(page.url()).toContain(checkoutPageUrl);
    await expect(page.getByTestId(locators.logInButtonLocator)).toBeVisible();
  });

  test('should navigate to Log In page', async ({ page }) => {
    await page.locator(locators.getNordVpnButtonLocator).click();
    await expect(page).toHaveTitle(pricingPageTitle);
    await expect(page).toHaveURL(pricingPageUrl);

    await page.locator(locators.getPlusPlanLocator).nth(0).click();
    await expect(page).toHaveTitle(checkoutPageTitle);
    expect(page.url()).toContain(checkoutPageUrl);
    await expect(page.getByTestId(locators.logInButtonLocator)).toBeVisible();

    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId(locators.logInButtonLocator).click();
    await expect(page).toHaveTitle(logInPageTitle);
    expect(page.url()).toContain(logInPageUrl);

    await expect(page.getByTestId(locators.signUpLinkLocator)).toBeVisible();
    await expect(page.getByTestId(locators.emailInputLocator)).toBeVisible();
    await expect(page.getByTestId(locators.submitButtonLocator)).toBeVisible();
    await expect(page.getByTestId(locators.forgotPasswordLinkLocator)).toBeVisible();
    await expect(page.getByTestId(locators.signUpGoogleButtonLocator)).toBeVisible();
    await expect(page.getByTestId(locators.signUpAppleButtonLocator)).toBeVisible();
    await expect(page.getByTestId(locators.signUpCodeButtonLocator)).toBeVisible();
    await expect(page.getByTestId(locators.supportLinkLocator)).toBeVisible();
    await expect(page.getByTestId(locators.termsAndConditionsButtonLocator)).toBeVisible();
    await expect(page.locator(locators.languageDropdownLocator)).toBeVisible();
  });
});
