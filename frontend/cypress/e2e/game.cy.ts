beforeEach(() => {
  cy.task("seedDatabase");
  cy.registerUser({
    email: "hpotter@example.com",
    username: "hpotter",
    password: "vingardiumleviosa",
  });
  cy.loginUser({
    username: "hpotter",
    password: "vingardiumleviosa",
  });
  cy.makeCookiesInsecure();
});

describe("game spec", () => {
  it("passes", () => {
    cy.visit("/game");

    // Consent to cookies.
    cy.contains("I accept").click();

    // Select the game mode.
    cy.get("[data-cy=left-arrow]").click();
    cy.contains("Standard Mode").click();
    cy.contains("Original").click();
    cy.contains("Medium").click();
    cy.contains("Word by Word").click();

    // Start the game.
    cy.contains("Start").click();

    // Get ready for the game.
    cy.wait(1000 * (3 + 1));
    // Play the game for max 1 minute.
    cy.get("[data-cy=progress-bar]", {
      timeout: 1000 * 60,
    }).should("not.exist");

    // Answer all questions.
    for (let i = 0; i < 10; i++) {
      cy.get(`[data-cy=question${i}-option0`).click();
    }

    // Submit the answers and statistics.
    cy.contains("Submit").click();

    // Check the results.
    cy.contains("Results");
  });
});
