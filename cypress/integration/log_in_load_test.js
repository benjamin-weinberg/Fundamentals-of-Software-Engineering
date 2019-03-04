describe('Going to log in', function() {
    it('From home goes to log on', function() {
      cy.visit('http://localhost:3000/public/home.html');

      cy.contains('Log in').click();

      cy.url().should('include', '/public/login.html');
    })
  })