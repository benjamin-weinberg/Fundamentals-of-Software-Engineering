describe('Load the sign up page', function() {
    it('From login goes to sign up', function() {
      cy.visit('http://localhost:3000/public/login.html');

      cy.contains('Sign up here').click();

      cy.url().should('include', '/public/signup.html');
    })
  })