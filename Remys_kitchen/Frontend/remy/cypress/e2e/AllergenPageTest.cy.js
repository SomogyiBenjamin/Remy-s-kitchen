describe('Allergen Page Functionality', () => {
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 1, // Adminisztrátor jogosultság
    Erzekeny: '',
    ProfilkepURL: ''
  };

  const mockUserAllergens = [
    { FelhasznaloId: mockUser.id, ErzekenysegNev: 'Tej' }
  ];

  beforeEach(() => {
    // Töröljük a localStorage-t és és egy új felhasználót állítunk be
    cy.window().then((win) => {
      win.localStorage.clear();
      win.localStorage.setItem('user', JSON.stringify(mockUser));
    });

    // Mockoljuk a felhasználó allergének lekérdezését
    cy.intercept('GET', `https://localhost:44350/api/Felhasznalo_Erzekenyseg/${mockUser.id}`, {
      statusCode: 200,
      body: mockUserAllergens
    }).as('getUserAllergens');

    // Mockoljuk a felhasználók lekérdezését
    cy.intercept('GET', 'https://localhost:44350/api/Felhasznalo', {
      statusCode: 200,
      body: [
        { Id: mockUser.id, Fnev: mockUser.Fnev }
      ]
    }).as('getUsers');

    cy.visit('http://localhost:3000/allergen');
  });

  it('Ellenőrzi, hogy az allergének megjelennek', () => {
    cy.get('h1.maintitle').contains('Válasszon allergént').should('be.visible');

    cy.wait('@getUserAllergens', { timeout: 10000 }).then((interception) => {
      cy.log('getUserAllergens kérés:', interception);
    });

    cy.get('.typesRow1 .item .card').contains('Tej').parent().find('input[type="checkbox"]').should('be.checked');
  });

  it('Új allergén hozzáadása', () => {
    cy.get('h1.maintitle').contains('Válasszon allergént').should('be.visible');

    cy.wait('@getUserAllergens', { timeout: 10000 });

    cy.intercept('POST', 'https://localhost:44350/api/Felhasznalo_Erzekenyseg', {
      statusCode: 200,
      body: { message: 'Allergén sikeresen mentve' }
    }).as('saveAllergen');

    //Tejet-t kikapcsoljuk
    cy.intercept('DELETE', `https://localhost:44350/api/Felhasznalo_Erzekenyseg?ErzNev=Tej&fid=${mockUser.id}`, {
      statusCode: 200,
      body: { message: 'Allergén sikeresen törölve' }
    }).as('deleteAllergen');

    // A Tej ki van választva, ezt kikapcsoljuk a kártyára kattintva
    cy.get(':nth-child(4) > .card').click();

    cy.get('.typesRow1 .item .card').contains('Tej').parent().find('input[type="checkbox"]').should('not.be.checked');

    cy.get(':nth-child(2) > :nth-child(3) > .card').click();

    // Ellenőrizzük, hogy a Tojás ki van-e választva
    cy.get('.typesRow1 .item .card').contains('Tojás').parent().find('input[type="checkbox"]').should('be.checked');

    // Mentés
    cy.get('.buttondiv').contains('Mentés').click();

    cy.wait('@deleteAllergen');

    // Ellenőrizzük, hogy a mentési kérés megtörtént
    cy.wait('@saveAllergen').then((interception) => {
      const requestBody = typeof interception.request.body === 'string' 
        ? JSON.parse(interception.request.body) 
        : interception.request.body;
      
      expect(requestBody).to.deep.equal({
        FelhasznaloId: mockUser.id,
        ErzekenysegNev: 'Tojás'
      });
    });

    // Ellenőrizzük, hogy a navigáció megtörtént
    cy.url().should('eq', 'http://localhost:3000/taste-profile');
  });

  it('Allergén törlése', () => {
    cy.get('h1.maintitle').contains('Válasszon allergént').should('be.visible');

    cy.wait('@getUserAllergens', { timeout: 10000 });

    // Tej törlése
    cy.intercept('DELETE', `https://localhost:44350/api/Felhasznalo_Erzekenyseg?ErzNev=Tej&fid=${mockUser.id}`, {
      statusCode: 200,
      body: { message: 'Allergén sikeresen törölve' }
    }).as('deleteAllergen');

    // A Tej törléséhez kattintunk a kártyára
    cy.get(':nth-child(4) > .card').click();

    // Ellenőrizzük, hogy a Tej már nincs kiválasztva
    cy.get('.typesRow1 .item .card').contains('Tej').parent().find('input[type="checkbox"]').should('not.be.checked');

    // Mentés
    cy.get('.buttondiv').contains('Mentés').click();

    cy.wait('@deleteAllergen');

    // Ellenőrizzük, hogy a navigáció megtörtént
    cy.url().should('eq', 'http://localhost:3000/taste-profile');
  });

  it('Hiba kezelése, ha a felhasználó allergének lekérdezése sikertelen', () => {
    cy.intercept('GET', `https://localhost:44350/api/Felhasznalo_Erzekenyseg/${mockUser.id}`, {
      statusCode: 500,
      body: {}
    }).as('getUserAllergensFailed');

    cy.visit('http://localhost:3000/allergen');

    cy.wait('@getUserAllergensFailed', { timeout: 10000 });
    cy.log('Hiba várható a konzolon: Error fetching sensitivities');
  });
});