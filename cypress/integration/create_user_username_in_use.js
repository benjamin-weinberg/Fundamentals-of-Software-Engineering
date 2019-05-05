describe('Load the sign up page', function() {
    it('From login goes to sign up sign up as new user with username already taken', function() {
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })
      cy.visit('http://localhost:3000/');

      cy.contains('Log in/Sign Up').click();

      cy.contains('Sign up here').click();
      cy.get('form').within(() =>{
        cy.get('#name').type('testName'); 
        cy.get('#email').type("testEmail");
        cy.get('#username').type('driver'); 
        cy.get('#password').type("driver");
        cy.get('#confirm').type("driver");
        cy.get('#accountType > :nth-child(1) > input').click();
        cy.get(':nth-child(7) > .btn').click();
      });
      
      cy.url().should('include', '/signup');
      
    })
  })