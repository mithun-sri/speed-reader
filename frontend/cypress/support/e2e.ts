// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

/* eslint-disable */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      registerUser(data: {
        email: string;
        username: string;
        password: string;
      }): Chainable<undefined>;

      loginUser(data: {
        username: string;
        password: string;
      }): Chainable<undefined>;
    }
  }
}
/* eslint-enable */

Cypress.Commands.add("registerUser", (data) => {
  cy.request({
    method: "POST",
    url: "/api/v1/users/register",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
});

Cypress.Commands.add("loginUser", (data) => {
  cy.request({
    method: "POST",
    url: "/api/v1/users/login",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
});
