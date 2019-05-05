describe('Create a new user', function() {
    it('From login goes to sign up and makes a new user', function() {
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })
      cy.visit('http://localhost:3000/');

      cy.contains('Log in/Sign Up').click();

      cy.contains('Sign up here').click();
      cy.get('form').within(() =>{
        cy.get('#name').type('testName2'); 
        cy.get('#email').type("testEmail2");
        cy.get('#username').type('testUsername2'); 
        cy.get('#password').type("testPassword2");
        cy.get('#confirm').type("testPassword2");
        cy.get('#accountType > :nth-child(2) > input').click();
        cy.get(':nth-child(7) > .btn').click();
      });
      
      cy.url().should('include', '/rider');
      
    })
  })