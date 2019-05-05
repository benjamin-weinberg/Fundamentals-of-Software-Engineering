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
        cy.get('#username').type('driver'); 
        cy.get('#password').type("driver");

      });
      cy.contains('Login').click();
      cy.get('form').within(() =>{
        cy.get('#start').type('testStart'); 
        cy.get('#dest').type("testDest");
        cy.get('#startTime').type('12:00:00'); 
        cy.get('#rideDate').type("2019-06-04");
      });
      
      

      cy.contains('Create Ride').click();
      cy.url().should('include', '/driver');
    })
  })