describe('Login Functionality with an admin privileged profile', () => {
  const mockUser = {
    Fnev: 'admin',
    Email: 'admin@admin.hu',
    Jogosultsag: 1,
    ProfilkepURL: 'testprofile.jpg'
  };

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });

    cy.intercept('POST', 'https://localhost:44350/api/Felhasznalo/authenticate', {
      statusCode: 200,
      body: mockUser
    }).as('authenticateUser');

    cy.visit('http://localhost:3000/log');
  });

  it('Ellenőrzi, hogy az űrlap elemei megjelennek', () => {
    cy.get('h1').should('have.text', 'Bejelentkezés');
    cy.get('input[type="text"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('.loginbutton').should('be.visible');
    cy.get('#text').should('have.text', 'Még nincs fiókod?');
    cy.get('.Regbutton').should('be.visible');
  });

  it('Sikeres bejelentkezés és navigáció a /home oldalra', () => {
    cy.get('input[type="text"]').type('admin@admin.hu');
    cy.get('input[type="password"]').type('Admin123');
    cy.get('.loginbutton').click();

    cy.wait('@authenticateUser').its('request.body').should('deep.equal', {
      Email: 'admin@admin.hu',
      Jelszo: 'Admin123'
    });


    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user'));
      expect(user).to.deep.equal(mockUser);
    });

    cy.url().should('eq', 'http://localhost:3000/home');
  });

  it('Sikertelen bejelentkezés hibaüzenettel', () => {
    cy.intercept('POST', 'https://localhost:44350/api/Felhasznalo/authenticate', {
      statusCode: 401,
      body: { error: 'Hibás email vagy jelszó.' }
    }).as('authenticateUser');

    cy.get('input[type="text"]').type('admin@admin.hu');
    cy.get('input[type="password"]').type('ad123');
    cy.get('.loginbutton').click();

    cy.wait('@authenticateUser');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('user')).to.be.null;
    });

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Sikertelen bejelentkezés!');
    });

    cy.url().should('eq', 'http://localhost:3000/log');
  });

  it('Hálózati hiba kezelése', () => {
    cy.intercept('POST', 'https://localhost:44350/api/Felhasznalo/authenticate', {
      forceNetworkError: true
    }).as('authenticateUser');

    cy.get('input[type="text"]').type('admin@admin.hu');
    cy.get('input[type="password"]').type('Admin123');
    cy.get('.loginbutton').click();

    cy.wait('@authenticateUser');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('user')).to.be.null;
    });

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Sikertelen bejelentkezés!');
    });

    cy.url().should('eq', 'http://localhost:3000/log');
  });

  it('Navigál a regisztrációs oldalra', () => {
    cy.get('.Regbutton').click();
    cy.url().should('eq', 'http://localhost:3000/reg');
  });

  it('Nem lehet üres űrlappal bejelentkezni', () => {
    cy.get('.loginbutton').click();


    cy.get('input[type="text"]').should('have.attr', 'required');
    cy.get('input[type="password"]').should('have.attr', 'required');


    cy.get('@authenticateUser').should('not.exist');

    cy.url().should('eq', 'http://localhost:3000/log');
  });


  it('Reszponzív megjelenés mobil nézetben', () => {
    cy.viewport('iphone-6');
    cy.get('h1').should('be.visible');
    cy.get('input[type="text"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('.loginbutton').should('be.visible');
    cy.get('.Regbutton').should('be.visible');
    cy.get('.footer-contentLogin').should('be.visible');

    cy.get('input[type="text"]').type('admin@admin.hu');
    cy.get('input[type="password"]').type('password123');
    cy.get('.loginbutton').click();

    cy.wait('@authenticateUser');
    cy.url().should('eq', 'http://localhost:3000/home');
  });
});


describe('Login Functionality with Normal User', () => {
  const mockUser = {
    Fnev: 'Példa',
    Email: 'pelda@pelda.hu',
    Jogosultsag: 2,
    ProfilkepURL: 'normaluserprofile.jpg'
  };

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });

    cy.intercept('POST', 'https://localhost:44350/api/Felhasznalo/authenticate', {
      statusCode: 200,
      body: mockUser
    }).as('authenticateUser');

    cy.visit('http://localhost:3000/log');
  });

  it('Ellenőrzi, hogy az űrlap elemei megjelennek', () => {
    cy.get('h1').should('have.text', 'Bejelentkezés');
    cy.get('input[type="text"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('.loginbutton').should('be.visible');
    cy.get('#text').should('have.text', 'Még nincs fiókod?');
    cy.get('.Regbutton').should('be.visible');
  });

  it('Sikeres bejelentkezés és navigáció a /home oldalra', () => {
    cy.get('input[type="text"]').type('pelda@pelda.hu');
    cy.get('input[type="password"]').type('Pelda123!');
    cy.get('.loginbutton').click();

    cy.wait('@authenticateUser').its('request.body').should('deep.equal', {
      Email: 'pelda@pelda.hu',
      Jelszo: 'Pelda123!'
    });

    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user'));
      expect(user).to.deep.equal(mockUser);
    });

    cy.url().should('eq', 'http://localhost:3000/home');
  });

  it('Sikertelen bejelentkezés hibaüzenettel', () => {
    cy.intercept('POST', 'https://localhost:44350/api/Felhasznalo/authenticate', {
      statusCode: 401,
      body: { error: 'Hibás email vagy jelszó.' }
    }).as('authenticateUser');

    cy.get('input[type="text"]').type('pelda@pelda.hu');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('.loginbutton').click();

    cy.wait('@authenticateUser');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('user')).to.be.null;
    });

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Sikertelen bejelentkezés!');
    });

    cy.url().should('eq', 'http://localhost:3000/log');
  });

  it('Navigál a regisztrációs oldalra', () => {
    cy.get('.Regbutton').click();
    cy.url().should('eq', 'http://localhost:3000/reg');
  });

  it('Nem lehet üres űrlappal bejelentkezni', () => {
    cy.get('.loginbutton').click();

    cy.get('input[type="text"]').should('have.attr', 'required');
    cy.get('input[type="password"]').should('have.attr', 'required');

    cy.get('@authenticateUser').should('not.exist');

    cy.url().should('eq', 'http://localhost:3000/log');
  });

});
