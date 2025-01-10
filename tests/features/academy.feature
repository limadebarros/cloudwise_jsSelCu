Feature: Academy Courses

  Scenario: Navigate to the Cloudwise Academy tab and verify the articles title
    Given I am at the Cloudwise website
    When I go to the Academy tab
    Then I verify that the page header matches the title of the course on the Academy page

  Scenario: Print the total number of articles grouped by category
    Given I am at the Cloudwise website
    When I go to the Academy tab
    Then I print the total number of courses grouped by category