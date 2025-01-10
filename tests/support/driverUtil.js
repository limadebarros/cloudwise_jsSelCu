const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { setDefaultTimeout } = require("@cucumber/cucumber");

setDefaultTimeout(90 * 1000);

let driver;

async function getDriver() {
  if (!driver) {
    driver = await new Builder()
      .forBrowser("chrome")
      .build();
  }
  return driver;
}

async function quitDriver() {
  if (driver) {
    await driver.quit();
    driver = null;
  }
}

async function bypassCookiePopup() {
  const cookiePopupSelector = '//*[contains(text(), "Wij gebruiken cookies")]';
  const acceptButtonSelector = '//*[contains(text(), "Accepteren")]';

  // Locate the cookie popup
  const cookiePopup = await driver.findElements(By.xpath(cookiePopupSelector));

  // Check if the cookie popup is present
  if (cookiePopup.length > 0) {
    // Wait for the cookie consent popup to be visible
    await driver.wait(until.elementIsVisible(cookiePopup[0]), 10000);
    
    // Click the accept button on the cookie popup
    await driver.findElement(By.xpath(acceptButtonSelector)).click();

    // Wait for the popup to disappear
    await driver.wait(until.stalenessOf(cookiePopup[0]), 10000);
  }
}

module.exports = { getDriver, quitDriver, bypassCookiePopup };
