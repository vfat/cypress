describe('Metamonitor Login Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8083/'); // Assuming this is the correct URL
    });

    it('menampilkan title Login To Metamonitor ', () => {
        cy.get('.card-body').should('contain','Login To Metamonitor');

    });
  
    it('menampilkan continue with google', () => {
        cy.get('.card-body').should('contain','Continue with Google');

    });

    it('menampilkan halaman login form dengan email dan password inputs', () => {
        cy.get('form input[name="email"]').should('be.visible');
        cy.get('form input[name="password"]').should('be.visible');
    });
  
    it('menampilkan "Forgot password?" link', () => {
        cy.get('a[href="/forgot-password"]').should('contain', 'Click here');
    });
  
    it('menampilkan "Sign up" link', () => {
        cy.get('a[href="/signup"]').should('contain', 'Sign up');
    });
  

});
  