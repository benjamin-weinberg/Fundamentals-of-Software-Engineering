describe('Click on the forgot password link', function() {
    it('From home goes to log on and then clicks forgot password', function() {
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })
      
      cy.visit('http://localhost:3000/home');

      cy.contains('Log in/Sign Up').click();


      //cy.get('.username').type('driver');
      

      cy.contains('Forgot Password?').click();
      cy.url().should('include', '/forgotPassword');
    })
  })