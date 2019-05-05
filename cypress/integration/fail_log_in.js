describe('Fail log in', function() {
    it('From home goes to log on and does not sign in', function() {
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })
      
      cy.visit('http://localhost:3000/home');

      cy.contains('Log in/Sign Up').click();

      cy.get('form').within(() =>{
        cy.get('#username').type('wrongUserName'); 
        cy.get('#password').type("badPassword");
      });
      
      

      cy.contains('Login').click();
      cy.url().should('include', '/login');
    })
  })