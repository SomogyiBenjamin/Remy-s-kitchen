describe('Upload Form Functionality', () => {
  const mockUser = {
    Fnev: 'Pelda',
    Email: 'pelda@pelda.hu',
    Jogosultsag: 1,
    ProfilkepURL: 'testprofile.jpg'
  };

  const mockCategories = [
    { Nev: 'Leves' },
    { Nev: 'Főétel' },
    { Nev: 'Desszert' }
  ];

  const mockTags = [
    { T_id: 1, Nev: 'Vegetáriánus' },
    { T_id: 2, Nev: 'Gluténmentes' },
    { T_id: 3, Nev: 'Gyors' }
  ];

  const mockIngredients = [
    { Hid: 1, Nev: 'Liszt' },
    { Hid: 2, Nev: 'Cukor' },
    { Hid: 3, Nev: 'Tojás' }
  ];

  const mockUnits = [
    { MertekegysegNev: 'g' },
    { MertekegysegNev: 'db' },
    { MertekegysegNev: 'tk' }
  ];

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('user', JSON.stringify(mockUser));
    });

    cy.intercept('GET', 'https://localhost:44350/api/Kategoria', {
      statusCode: 200,
      body: mockCategories
    }).as('getCategories');

    cy.intercept('GET', 'https://localhost:44350/api/Tag', {
      statusCode: 200,
      body: mockTags
    }).as('getTags');

    cy.intercept('GET', 'https://localhost:44350/api/Hozzavalo', {
      statusCode: 200,
      body: mockIngredients
    }).as('getIngredients');

    cy.intercept('GET', 'https://localhost:44350/api/Mertekegyseg_Hozzavalo/1', {
      statusCode: 200,
      body: mockUnits
    }).as('getUnitsForLiszt');

    cy.intercept('GET', 'https://localhost:44350/api/Mertekegyseg_Hozzavalo', {
      statusCode: 200,
      body: mockUnits
    }).as('getAllUnits');

    cy.visit('http://localhost:3000/upload');
  });

  it('Ellenőrzi, hogy az űrlap elemei megjelennek', () => {
    cy.wait('@getCategories');
    cy.wait('@getTags');
    cy.wait('@getIngredients');

    cy.get('.upload-title').should('have.text', 'Recept Feltöltése');
    cy.get('#title').should('be.visible');
    cy.get('#description').should('be.visible');
    cy.get('#category').should('be.visible');
    cy.get('#time').should('be.visible');
    cy.get('#difficultyInput').should('be.visible');
    cy.get('#image').should('be.visible');
    cy.get('#ingredientFirst').should('be.visible');
    cy.get('#mennyiseg').should('be.visible');
    cy.get('#mertekegysegThird').should('be.visible');
    cy.get('#measureButton').should('be.visible');
    cy.get('.step-input input').should('be.visible');
    cy.get('#descriptionButton').should('be.visible');
    cy.get('.tag-select').should('be.visible');
    cy.get('.tagaddbutton').should('be.visible');
    cy.get('.submit-buttonUpload').should('be.visible');
  });

  it('Hozzáad egy hozzávalót az űrlaphoz', () => {
    cy.wait('@getIngredients');

    cy.get('#ingredientFirst').type('Liszt');
    cy.get('.autocomplete-list li').contains('Liszt').click();
    cy.wait('@getUnitsForLiszt');
    cy.wait('@getAllUnits');

    cy.get('#mennyiseg').type('200');
    cy.get('#mertekegysegThird').select('g');

    cy.get('#measureButton').click();

    cy.get('.ingredient-list li').should('contain.text', 'Liszt - 200 g');
  });

  it('Hozzáad egy lépést az űrlaphoz', () => {
    cy.get('.step-input input').type('Melegítsd elő a sütőt 180°C-ra.');
    cy.get('#descriptionButton').click();

    cy.get('.step-list li').should('contain.text', 'Melegítsd elő a sütőt 180°C-ra.');
  });

  it('Hozzáad egy taget az űrlaphoz', () => {
    cy.wait('@getTags');

    cy.get('.tag-select').select('Vegetáriánus');
    cy.get('.tagaddbutton').click();

    cy.get('.tag-list li').should('contain.text', 'Vegetáriánus');
  });

  it('Sikeresen menti a receptet és megjelenik a modális ablak', () => {
    cy.intercept('POST', 'https://localhost:44350/api/Recept', {
      statusCode: 200,
      body: { Rid: 1 }
    }).as('saveRecipe');

    cy.intercept('POST', 'https://localhost:44350/api/Recept_Hozzavalo', {
      statusCode: 200
    }).as('saveIngredient');

    cy.intercept('POST', 'https://localhost:44350/api/Lepes', {
      statusCode: 200
    }).as('saveStep');

    cy.intercept('POST', 'https://localhost:44350/api/Recept_Tag', {
      statusCode: 200
    }).as('saveTag');

    cy.intercept('POST', 'https://localhost:44350/api/Multimedia', {
      statusCode: 200
    }).as('saveMultimedia');

    cy.get('#title').type('Teszt Recept');
    cy.get('#description').type('Ez egy teszt recept leírása.');
    cy.get('#category').select('Leves');
    cy.get('#time').type('30');
    cy.get('#difficultyInput').select('Közepes');

    cy.get('#ingredientFirst').type('Liszt');
    cy.get('.autocomplete-list li').contains('Liszt').click();
    cy.wait('@getUnitsForLiszt');
    cy.wait('@getAllUnits');
    cy.get('#mennyiseg').type('200');
    cy.get('#mertekegysegThird').select('g');
    cy.get('#measureButton').click();

    cy.get('.step-input input').type('Melegítsd elő a sütőt 180°C-ra.');
    cy.get('#descriptionButton').click();

    cy.get('.tag-select').select('Vegetáriánus');
    cy.get('.tagaddbutton').click();

    cy.get('.submit-buttonUpload').click();

    cy.wait('@saveRecipe');
    cy.wait('@saveIngredient');
    cy.wait('@saveStep');
    cy.wait('@saveTag');
    cy.wait('@saveMultimedia');

    cy.get('.modal-content', { timeout: 6000 }).should('be.visible');
    cy.get('.modal-content').contains('Recepted sikeresen feltöltésre került!').should('be.visible');
    cy.get('.modal-content').contains('Az általad feltöltött recept a moderátorok által hamarosan ellenőrzésre kerül.').should('be.visible');
    cy.get('.modal-content button').contains('Megértettem').click();

    cy.get('.modal-content').should('not.exist');

    cy.url().should('eq', 'http://localhost:3000/upload');
  });

  it('Hibát jelez, ha a cím üres', () => {
    cy.get('#description').type('Ez egy teszt recept leírása.');
    cy.get('#category').select('Leves');
    cy.get('#time').type('30');
    cy.get('#difficultyInput').select('Közepes');

    cy.get('.submit-buttonUpload').click();

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Kérlek, add meg a recept nevét!');
    });
  });

  it('Hibát jelez, ha a recept mentése sikertelen (API hiba)', () => {
    cy.intercept('POST', 'http://127.0.0.1:5000/upload', {
      statusCode: 200,
      body: {
        message: 'Fájl sikeresen feltöltve.',
        file_path: '/public/asserts/kepek/1698771234_testimage.png'
      }
    }).as('uploadImage');
  
    cy.intercept('POST', 'https://localhost:44350/api/Recept', {
      statusCode: 500,
      body: { error: 'Szerver hiba történt.' }
    }).as('saveRecipe');
  
    cy.get('#title').type('Teszt Recept');
    cy.get('#description').type('Ez egy teszt recept leírása.');
    cy.get('#category').select('Leves');
    cy.get('#time').type('30');
    cy.get('#difficultyInput').select('Közepes');
    
    cy.get('#ingredientFirst').type('Liszt');
    cy.get('.autocomplete-list li').contains('Liszt').click();
    cy.wait('@getUnitsForLiszt');
    cy.wait('@getAllUnits');
    cy.get('#mennyiseg').type('200');
    cy.get('#mertekegysegThird').select('g');
    cy.get('#measureButton').click();
  
    cy.get('.step-input input').type('Melegítsd elő a sütőt 180°C-ra.');
    cy.get('#descriptionButton').click();
  
    cy.get('.tag-select').select('Vegetáriánus');
    cy.get('.tagaddbutton').click();
  
    cy.get('.submit-buttonUpload').click();
  
    cy.wait('@saveRecipe');
  
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Hiba történt a mentés során!');
    });
  
    cy.get('.modal-content').should('not.exist');
  });


  it('Hozzávaló eltávolítása az űrlapról', () => {
    cy.wait('@getIngredients');
  
    cy.get('#ingredientFirst').type('Liszt');
    cy.get('.autocomplete-list li').contains('Liszt').click();
    cy.wait('@getUnitsForLiszt');
    cy.wait('@getAllUnits');
    cy.get('#mennyiseg').type('200');
    cy.get('#mertekegysegThird').select('g');
    cy.get('#measureButton').click();
  
    cy.get('.ingredient-list li').should('contain.text', 'Liszt - 200 g');
  
    cy.get('.ingredient-list li').eq(0).find('.removeImage').click();
  
    cy.get('.ingredient-list li').should('not.exist');
  });


  it('Különböző kategóriák és nehézségi szintek kiválasztása', () => {
    cy.intercept('POST', 'https://localhost:44350/api/Recept', (req) => {
      req.reply({
        statusCode: 200,
        body: { Rid: 1 }
      });
      expect(req.body.KategoriaNev).to.equal('Főétel');
      expect(req.body.Nehezseg).to.equal('Nehéz');
    }).as('saveRecipe');
  
    cy.intercept('POST', 'https://localhost:44350/api/Recept_Hozzavalo', {
      statusCode: 200
    }).as('saveIngredient');
  
    cy.intercept('POST', 'https://localhost:44350/api/Lepes', {
      statusCode: 200
    }).as('saveStep');
  
    cy.intercept('POST', 'https://localhost:44350/api/Recept_Tag', {
      statusCode: 200
    }).as('saveTag');
  
    cy.intercept('POST', 'https://localhost:44350/api/Multimedia', {
      statusCode: 200
    }).as('saveMultimedia');
  
    cy.get('#title').type('Teszt Recept');
    cy.get('#description').type('Ez egy teszt recept leírása.');
    cy.get('#category').select('Főétel');
    cy.get('#time').type('45');
    cy.get('#difficultyInput').select('Nehéz');
  
    cy.get('#ingredientFirst').type('Liszt');
    cy.get('.autocomplete-list li').contains('Liszt').click();
    cy.wait('@getUnitsForLiszt');
    cy.wait('@getAllUnits');
    cy.get('#mennyiseg').type('200');
    cy.get('#mertekegysegThird').select('g');
    cy.get('#measureButton').click();
  
    cy.get('.step-input input').type('Melegítsd elő a sütőt 180°C-ra.');
    cy.get('#descriptionButton').click();
  
    cy.get('.tag-select').select('Vegetáriánus');
    cy.get('.tagaddbutton').click();
  
    cy.get('.submit-buttonUpload').click();
  
    cy.wait('@saveRecipe');
    cy.wait('@saveIngredient');
    cy.wait('@saveStep');
    cy.wait('@saveTag');
    cy.wait('@saveMultimedia');
  
    cy.get('.modal-content', { timeout: 6000 }).should('be.visible');
    cy.get('.modal-content > .tagaddbutton').click();
  });


  it('Autocomplete működése a hozzávalók bevitelénél', () => {
    cy.wait('@getIngredients');
  
    cy.get('#ingredientFirst').type('Li');
    cy.get('.autocomplete-list li').should('have.length', 1);
    cy.get('.autocomplete-list li').contains('Liszt').should('be.visible');
  
    cy.get('#ingredientFirst').type('szt');
    cy.get('.autocomplete-list li').contains('Liszt').click();
  
    cy.get('#ingredientFirst').should('have.value', 'Liszt');
    cy.wait('@getUnitsForLiszt');
    cy.wait('@getAllUnits');
  
    cy.get('#mertekegysegThird').should('be.visible');
    cy.get('#mertekegysegThird option').should('contain', 'g');
  });
});