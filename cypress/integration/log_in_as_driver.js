describe('Log in as drive', function() {
    it('From home goes to log on and sigs in as driver', function() {
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })
      
      cy.visit('http://localhost:3000/home');

      cy.contains('Log in/Sign Up').click();

      cy.get('form').within(() =>{
        cy.get('#username').type('driver'); 
        cy.get('#password').type("driver");
      });
      //cy.get('.username').type('driver');
      

      cy.contains('Login').click();
      cy.url().should('include', '/driver');
    })
  })