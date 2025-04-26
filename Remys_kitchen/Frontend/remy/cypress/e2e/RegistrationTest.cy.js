describe('reg Functionality', () => {
  const mockUsers = [
    {
      id: 1,
      Fnev: 'ExistingUser',
      Email: 'existing@pelda.hu',
      Jelszo: 'Existing123!',
      Jogosultsag: 2,
      Erzekeny: '',
      ProfilkepURL: ''
    },
    {
      id: 2,
      Fnev: 'admin', // Hozzáadjuk a foglalt felhasználónevet
      Email: 'admin@admin.hu', // Hozzáadjuk a foglalt emailt
      Jelszo: 'Test123!@',
      Jogosultsag: 1,
      Erzekeny: '',
      ProfilkepURL: ''
    }
  ];

  const mockNewUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 2,
    Erzekeny: '',
    ProfilkepURL: ''
  };

  const mockUpdatedUsers = [...mockUsers, mockNewUser];

  beforeEach(() => {
    // Töröljük a localStorage-t minden teszt előtt
    cy.window().then((win) => {
      win.localStorage.clear();
    });

    // Mockoljuk a meglévő felhasználók lekérdezését (foglaltság ellenőrzéshez)
    cy.intercept('GET', 'https://localhost:44350/api/Felhasznalo', {
      statusCode: 200,
      body: mockUsers
    }).as('getUsers');

    // Mockoljuk a képfeltöltést
    cy.intercept('POST', 'http://localhost:5000/upload', {
      statusCode: 200,
      body: { file_path: '/uploads/images/uploaded_image.jpg' }
    }).as('uploadImage');

    // Mockoljuk a regisztrációs API-t
    cy.intercept('POST', 'https://localhost:44350/api/Felhasznalo', {
      statusCode: 200,
      body: mockNewUser
    }).as('registerUser');

    // Mockoljuk a felhasználók lekérdezését a regisztráció után
    cy.intercept('GET', 'https://localhost:44350/api/Felhasznalo', {
      statusCode: 200,
      body: mockUpdatedUsers,
      headers: { 'Content-Type': 'application/json' }
    }).as('getUsersAfterRegister');

    cy.visit('http://localhost:3000/reg');
  });

  it('Ellenőrzi, hogy az űrlap elemei megjelennek', () => {
    cy.get('h2').contains('Regisztráció').should('be.visible');
    cy.get('#fname').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#rePassword').should('be.visible');
    cy.get('.button2').should('be.visible');
    cy.get('#profilePicture').should('be.visible');
  });

  it('Felhasználónév validáció: túl rövid felhasználónév', () => {
    cy.get('#fname').type('ab'); // Kevesebb mint 3 karakter
    cy.wait(100); // Várunk, hogy az állapotfrissítés megtörténjen
    cy.get('#fix').should('contain.text', 'Nem teljesül');
    cy.get('.progress-bar').eq(0).invoke('attr', 'style').should('contain', 'width: 0%');
    cy.get('.progress-bar').eq(0).should('have.css', 'background-color', 'rgb(255, 0, 0)'); // Red
  });

  it('Felhasználónév validáció: megfelelő hosszúságú felhasználónév', () => {
    cy.get('#fname').type('TestUser'); // Legalább 3 karakter
    cy.wait(100);
    cy.get('#fix').should('contain.text', 'Teljesül');
    cy.get('.progress-bar').eq(0).invoke('attr', 'style').should('contain', 'width: 100%');
    cy.get('.progress-bar').eq(0).should('have.css', 'background-color', 'rgb(0, 128, 0)'); // Green
  });

  it('Email validáció: érvénytelen email formátum', () => {
    cy.get('#email').type('invalid-email'); // Érvénytelen formátum
    cy.wait(100);
    cy.get('#fix2').should('contain.text', 'Nem teljesül');
    cy.get('.progress-bar').eq(1).invoke('attr', 'style').should('contain', 'width: 0%');
    cy.get('.progress-bar').eq(1).should('have.css', 'background-color', 'rgb(255, 0, 0)'); // Red
  });

  it('Email validáció: érvényes email formátum', () => {
    cy.get('#email').type('test@pelda.hu'); // Érvényes formátum
    cy.wait(100);
    cy.get('#fix2').should('contain.text', 'Teljesül');
    cy.get('.progress-bar').eq(1).invoke('attr', 'style').should('contain', 'width: 100%');
    cy.get('.progress-bar').eq(1).should('have.css', 'background-color', 'rgb(0, 128, 0)'); // Green
  });

  it('Jelszó validáció: gyenge jelszó', () => {
    cy.get('#password').type('test'); // Nem felel meg a kritériumoknak
    cy.wait(100);
    cy.get('#fix3').should('contain.text', 'Jelszó erőssége: Gyenge');
    cy.get('.progress-bar').eq(2).invoke('attr', 'style').should('contain', 'width: 20%');
    cy.get('.progress-bar').eq(2).should('have.css', 'background-color', 'rgb(255, 0, 0)'); // Red

    // Ellenőrizzük a kritériumok listáját
    cy.get('.bubblelistli').eq(0).should('have.class', 'bubblelistliIncorrect'); // Minimum 8 karakter
    cy.get('.bubblelistli').eq(1).should('have.class', 'bubblelistliIncorrect'); // Kis- és nagybetű
    cy.get('.bubblelistli').eq(2).should('have.class', 'bubblelistliIncorrect'); // Egy szám
    cy.get('.bubblelistli').eq(3).should('have.class', 'bubblelistliIncorrect'); // Speciális karakter
  });

  it('Jelszó validáció: erős jelszó', () => {
    cy.get('#password').type('Test123!@'); // Megfelel az összes kritériumnak
    cy.wait(100);
    cy.get('#fix3').should('contain.text', 'Extrém erős');
    cy.get('.progress-bar').eq(2).invoke('attr', 'style').should('contain', 'width: 100%');
    cy.get('.progress-bar').eq(2).should('have.css', 'background-color', 'rgb(0, 128, 0)'); // Green

    // Ellenőrizzük a kritériumok listáját
    cy.get('.bubblelistli').eq(0).should('have.class', 'bubblelistliCorrect'); // Minimum 8 karakter
    cy.get('.bubblelistli').eq(1).should('have.class', 'bubblelistliCorrect'); // Kis- és nagybetű
    cy.get('.bubblelistli').eq(2).should('have.class', 'bubblelistliCorrect'); // Egy szám
    cy.get('.bubblelistli').eq(3).should('have.class', 'bubblelistliCorrect'); // Speciális karakter
  });

  it('Jelszó megerősítése: nem egyező jelszavak', () => {
    cy.get('#password').type('Test123!@');
    cy.get('#rePassword').type('Test123!'); // Nem egyezik
    cy.get('#fname').type('TestUser');
    cy.get('#email').type('test@pelda.hu');
    cy.get('.button2').click();

    cy.get('#rePassword').should('have.class', 'error');
  });

  it('Sikeres regisztráció és navigáció az /allergen oldalra', () => {
    cy.get('#fname').type('TestUser');
    cy.get('#email').type('test@pelda.hu');
    cy.get('#password').type('Test123!@');
    cy.get('#rePassword').type('Test123!@');

    cy.get('.button2').click();

    cy.wait('@registerUser').its('request.body').should('deep.equal', {
      Fnev: 'TestUser',
      Email: 'test@pelda.hu',
      Jelszo: 'Test123!@',
      Jogosultsag: 2,
      Erzekeny: '',
      ProfilkepURL: ''
    });

    cy.wait('@getUsersAfterRegister');

    cy.url().should('eq', 'http://localhost:3000/allergen');
  });

  it('Foglalt felhasználónév ellenőrzése', () => {
    // Stub az alert függvényhez
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('#fname').type('admin'); // Már létező felhasználónév
    cy.get('#email').type('unique@pelda.hu'); // Egyedi email
    cy.get('#password').type('Test123!@');
    cy.get('#rePassword').type('Test123!@');

    cy.get('.button2').click();

    cy.get('@alert').should('have.been.calledWith', 'Ez a felhasználónév már foglalt!');
  });

  it('Foglalt email ellenőrzése', () => {
    // Stub az alert függvényhez
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('#fname').type('UniqueUser'); // Egyedi felhasználónév
    cy.get('#email').type('admin@admin.hu'); // Már létező email
    cy.get('#password').type('Test123!@');
    cy.get('#rePassword').type('Test123!@');

    cy.get('.button2').click();

    cy.get('@alert').should('have.been.calledWith', 'Ez az Email cím már foglalt!');
  });

  it('Hálózati hiba kezelése a regisztráció során', () => {
    cy.intercept('POST', 'https://localhost:44350/api/Felhasznalo', {
      forceNetworkError: true
    }).as('registerUser');

    cy.get('#fname').type('TestUser');
    cy.get('#email').type('test@pelda.hu');
    cy.get('#password').type('Test123!@');
    cy.get('#rePassword').type('Test123!@');

    cy.get('.button2').click();

    cy.wait('@registerUser');

    cy.url().should('eq', 'http://localhost:3000/reg');
  });

  it('Reszponzív megjelenés mobil nézetben', () => {
    cy.viewport('iphone-6'); // 375x667
    cy.get('h2').contains('Regisztráció').should('be.visible');
    cy.get('#fname').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#rePassword').should('be.visible');
    cy.get('.button2').should('be.visible');
    cy.get('#profilePicture').should('be.visible');

    cy.get('#fname').type('TestUser');
    cy.get('#email').type('test@pelda.hu');
    cy.get('#password').type('Test123!@');
    cy.get('#rePassword').type('Test123!@');

    cy.get('.button2').click();

    cy.wait('@registerUser');
    cy.url().should('eq', 'http://localhost:3000/allergen');
  });
});