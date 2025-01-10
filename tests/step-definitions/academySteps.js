const { Given, When, Then, AfterAll } = require("@cucumber/cucumber");
const { getDriver, quitDriver, bypassCookiePopup } = require("../support/driverUtil");
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

let driver;

Given("I am at the Cloudwise website", async function () {
  driver = await getDriver();
  await driver.get("https://cloudwise.nl/");
});

When('I go to the Academy tab', async function () {
  await bypassCookiePopup();
  const academyTab = await driver.findElement(By.linkText('Academy'));
  await academyTab.click();
  await driver.wait(until.elementLocated(By.css('.pageIntro h1')), 10000);
  const expectedTitle = 'Academy';
  const actualTitle = await driver.findElement(By.css('.pageIntro h1')).getText();
  assert.strictEqual(actualTitle,expectedTitle,`Expected title to be "${expectedTitle}", but got "${actualTitle}"`);
});

Then('I verify that the page header matches the title of the course on the Academy page', async function () {
  // Wait for the courses to be located
  await driver.wait(until.elementLocated(By.css('.dienst-item h4')), 20000); 
  // Find all courses title
  const articles = await driver.findElements(By.css('.dienst-item h4')); 
  assert(articles.length > 0,'No courses found on the Academy page.');

  let articleTitles = [];
  for (const article of articles) {
      // Get the text of the article
      const title = await article.getText();
      // Add the title to the list
      articleTitles.push(title);
  }

  for (const title of articleTitles) {
      // Wait until the course title is located
      const articleElement = await driver.wait(until.elementLocated(By.xpath(`//h4[text()="${title}"]`)),20000); 
      // Wait until the course is visible and click
      await driver.wait(until.elementIsVisible(articleElement), 20000); 
      await articleElement.click(); 
      // Wait until the page header matches the expected title
      const headerLocator = By.css('.pageIntro h1');
      await driver.wait(async () => {
        const headerElement = await driver.findElement(headerLocator);
        const pageHeader = await headerElement.getText();
        return pageHeader === title;
      }, 20000);
      // Retrieve the page header text and assert it matches the expected title
      const headerElement = await driver.findElement(headerLocator);
      const pageHeader = await headerElement.getText();
      assert.strictEqual(pageHeader,title,`Expected page header to be "${title}", but got "${pageHeader}".`);
      // Navigate back to the previous page
      await driver.navigate().back(); 
      await driver.wait(until.elementLocated(By.css('.dienst-item h4')), 20000); 
  }
});

Then('I print the total number of courses grouped by category', async function () {
  // Wait for courses to be visible
  await driver.wait(until.elementLocated(By.css('.dienst-item')), 10000); 
  // Find all course elements
  const courses = await driver.findElements(By.css('.dienst-item')); 
  // Total number of courses
  const totalCourses = courses.length; 
 // Initialize a count object for different categories
  const categoryCount = {
      OPLEIDING: 0,
      BOOTCAMP: 0,
      WORKSHOP: 0,
  };

  for (const course of courses) {
    // Find category elements within the course
      const categories = await course.findElements(By.css('.kenmerken span')); 
      for (const category of categories) {
        // Get the category text and convert to uppercase
          const categoryText = (await category.getText()).toUpperCase(); 
          if (categoryCount.hasOwnProperty(categoryText)) {
            // Increment the count for the category
              categoryCount[categoryText]++; 
          }
      }
  }
  // Print the total number of courses
  console.log(`Total number of courses - ${totalCourses}`); 
  for (const [key, value] of Object.entries(categoryCount)) {
    // Print category counts
      console.log(`Number of articles that has category ${key} - ${value}`); 
  }
});
// Cleanup after all scenarios
AfterAll(async function () {
  await quitDriver();
});