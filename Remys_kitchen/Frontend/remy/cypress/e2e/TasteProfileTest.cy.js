describe('TasteProfile Functionality', () => {
  const mockUser = {
    Id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 2,
    Erzekeny: '',
    ProfilkepURL: ''
  };

  const mockTags = [
    { Tid: 1, Nev: 'Magyaros' },
    { Tid: 3, Nev: 'Vegetáriánus' },
    { Tid: 4, Nev: 'Gyors' },
    { Tid: 5, Nev: 'Diétás' },
    { Tid: 6, Nev: 'Csípős' },
    { Tid: 7, Nev: 'Édes' },
    { Tid: 8, Nev: 'Sós' },
    { Tid: 9, Nev: 'Csokis' },
    { Tid: 10, Nev: 'Gluténmentes' },
    { Tid: 11, Nev: 'Laktózmentes' },
    { Tid: 12, Nev: 'Cukormentes' },
    { Tid: 13, Nev: 'Alkoholos' },
    { Tid: 14, Nev: 'Tésztás' },
    { Tid: 15, Nev: 'Ázsiai ízvilágú' },
    { Tid: 16, Nev: 'Európai ízvilágú' },
    { Tid: 17, Nev: 'Amerikai ízvilágú' },
    { Tid: 18, Nev: 'Egészséges' },
    { Tid: 19, Nev: 'Vegán' }
  ];

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
      win.localStorage.setItem('user', JSON.stringify(mockUser));
    });

    cy.intercept('GET', 'https://localhost:44350/api/Tag', {
      statusCode: 200,
      body: mockTags
    }).as('getTags');

    cy.intercept('POST', `https://localhost:44350/api/Izles?F_id=${mockUser.Id}`, {
      statusCode: 200,
      body: {}
    }).as('saveTasteProfile');

    cy.visit('http://localhost:3000/taste-profile');
  });

  it('Ellenőrzi, hogy a tagek megjelennek', () => {
    cy.get('h1').contains('Milyen ízvilágú ételeket kedvelsz?').should('be.visible');
    cy.wait('@getTags');

    cy.get('.tags-container .tag').should('have.length', mockTags.length);
    mockTags.forEach((tag) => {
      cy.get('.tags-container .tag').contains(tag.Nev).should('be.visible');
    });

    cy.get('.submit-button').contains('Küldés').should('be.visible');
  });

  it('Tagek kiválasztása és eltávolítása', () => {
    cy.wait('@getTags');

    cy.get('.tags-container .tag').contains('Édes').click();
    cy.get('.tags-container .tag').contains('Édes').should('have.class', 'selected');

    cy.get('.tags-container .tag').contains('Csípős').click();
    cy.get('.tags-container .tag').contains('Csípős').should('have.class', 'selected');

    cy.get('.tags-container .tag').contains('Sós').should('not.have.class', 'selected');


    cy.get('.tags-container .tag').contains('Édes').click();
    cy.get('.tags-container .tag').contains('Édes').should('not.have.class', 'selected');

    cy.get('.tags-container .tag').contains('Csípős').should('have.class', 'selected');
  });

  it('Tagek mentése és navigáció a /log oldalra', () => {
    cy.wait('@getTags');


    cy.get('.tags-container .tag').contains('Édes').click();
    cy.get('.tags-container .tag').contains('Csípős').click();

    cy.get('.submit-button').click();

    cy.wait('@saveTasteProfile').its('request.body').should('deep.equal', {
      TagNev: 'Édes'
    });
    cy.wait('@saveTasteProfile').its('request.body').should('deep.equal', {
      TagNev: 'Csípős'
    });

    cy.url().should('eq', 'http://localhost:3000/log');
  });

  it('Hiba kezelése, ha a tagek betöltése sikertelen', () => {
    cy.intercept('GET', 'https://localhost:44350/api/Tag', {
      statusCode: 500,
      body: {}
    }).as('getTags');

    cy.visit('http://localhost:3000/taste-profile');

    cy.wait('@getTags');
    cy.get('.tags-container p').contains('Nem jeleníthetők meg tagek.').should('be.visible');
  });
});