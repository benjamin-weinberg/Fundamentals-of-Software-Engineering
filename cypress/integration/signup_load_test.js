describe('Load the sign up page', function() {
    it('From login goes to sign up', function() {
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })
      cy.visit('http://localhost:3000/');

      cy.contains('Log in/Sign Up').click();

      cy.contains('Sign up here').click();

      cy.url().should('include', '/signup');
      
    })
  })