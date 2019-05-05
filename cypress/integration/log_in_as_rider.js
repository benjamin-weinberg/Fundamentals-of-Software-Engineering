describe('Log in as rider and sign up for ride', function() {
    it('From home goes to log on and signs in as rider', function() {
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })
      
      cy.visit('http://localhost:3000/home');

      cy.contains('Log in/Sign Up').click();

      cy.get('form').within(() =>{
        cy.get('#username').type('rider'); 
        cy.get('#password').type("rider");
      });
      
      

      cy.contains('Login').click();
      cy.contains('Submit').click();
      cy.url().should('include', '/rider');
    })
  })