describe('WhatsInYourFridge Functionality', () => {
    const mockRecipes = [
      {
        Rid: 1,
        Nev: 'Teszt Recept 1',
        Leiras: 'Ez egy teszt recept.',
        HozzavaloDb: 3,
        KategoriaNev: 'Leves',
        FelhasznaloNev: 'TestUser',
        Allapot: 1,
        Eperc: 30,
        Szakmai: false,
        Nehezseg: 'Közepes',
      },
      {
        Rid: 2,
        Nev: 'Teszt Recept 2',
        Leiras: 'Ez egy másik teszt recept.',
        HozzavaloDb: 2,
        KategoriaNev: 'Főétel',
        FelhasznaloNev: 'TestUser',
        Allapot: 1,
        Eperc: 45,
        Szakmai: false,
        Nehezseg: 'Nehéz',
      },
    ];
  
    const mockIngredientsForRecipe1 = [
      { HozzavaloNev: 'Liszt', Mennyiseg: 200, Mertekegyseg: 'g' },
      { HozzavaloNev: 'Cukor', Mennyiseg: 50, Mertekegyseg: 'g' },
      { HozzavaloNev: 'Tojás', Mennyiseg: 2, Mertekegyseg: 'db' },
    ];
  
    const mockIngredientsForRecipe2 = [
      { HozzavaloNev: 'Liszt', Mennyiseg: 300, Mertekegyseg: 'g' },
      { HozzavaloNev: 'Só', Mennyiseg: 5, Mertekegyseg: 'g' },
    ];
  
    const mockRatings = [
      { ReceptId: 1, Csillag: 4 },
      { ReceptId: 1, Csillag: 5 },
      { ReceptId: 2, Csillag: 3 },
    ];
  
    const mockExistingIngredients = [
      { Hid: 1, Nev: 'Liszt' },
      { Hid: 2, Nev: 'Cukor' },
      { Hid: 3, Nev: 'Tojás' },
      { Hid: 4, Nev: 'Só' },
    ];
  
    const mockUnits = [
      { MertekegysegNev: 'g' },
      { MertekegysegNev: 'db' },
    ];
  
    beforeEach(() => {
      cy.intercept('GET', 'https://localhost:44350/api/Hozzavalo', {
        statusCode: 200,
        body: mockExistingIngredients,
      }).as('getIngredients');
  
      cy.intercept('GET', 'https://localhost:44350/api/Recept', {
        statusCode: 200,
        body: mockRecipes,
      }).as('getRecipes');
  
      cy.intercept('GET', 'https://localhost:44350/api/Multimedia/1', {
        statusCode: 200,
        body: [{ URL: 'testimage.jpg' }],
      }).as('getImageForRecipe1');
  
      cy.intercept('GET', 'https://localhost:44350/api/Multimedia/2', {
        statusCode: 200,
        body: [{ URL: 'testimage2.jpg' }],
      }).as('getImageForRecipe2');
  
      cy.intercept('GET', 'https://localhost:44350/api/Ertekeles', {
        statusCode: 200,
        body: mockRatings,
      }).as('getRatings');
  
      cy.intercept('GET', 'https://localhost:44350/api/Recept_Hozzavalo/1', {
        statusCode: 200,
        body: mockIngredientsForRecipe1,
      }).as('getIngredientsForRecipe1');
  
      cy.intercept('GET', 'https://localhost:44350/api/Recept_Hozzavalo/2', {
        statusCode: 200,
        body: mockIngredientsForRecipe2,
      }).as('getIngredientsForRecipe2');
  
      // Mockoljuk a mértékegységeket minden hozzávalóhoz
      cy.intercept('GET', 'https://localhost:44350/api/Mertekegyseg_Hozzavalo/1', {
        statusCode: 200,
        body: mockUnits,
      }).as('getUnitsForLiszt');
  
      cy.intercept('GET', 'https://localhost:44350/api/Mertekegyseg_Hozzavalo/2', {
        statusCode: 200,
        body: mockUnits,
      }).as('getUnitsForCukor');
  
      cy.intercept('GET', 'https://localhost:44350/api/Mertekegyseg_Hozzavalo/3', {
        statusCode: 200,
        body: mockUnits,
      }).as('getUnitsForTojas');
  
      cy.intercept('GET', 'https://localhost:44350/api/Mertekegyseg_Hozzavalo/4', {
        statusCode: 200,
        body: mockUnits,
      }).as('getUnitsForSo');
  
      cy.intercept('POST', 'https://localhost:44350/atvaltas', {
        statusCode: 200,
        body: 200,
      }).as('unitConversion');
  
      cy.visit('http://localhost:3000/fridge');
    });
  
    it('Ellenőrzi, hogy az oldal elemei megjelennek', () => {
      cy.wait('@getIngredients');
      cy.wait('@getRecipes');
      cy.wait('@getRatings');
  
      cy.get('h2').should('have.text', 'Mi van a hűtődben?');
      cy.get('input[placeholder="Hozzávaló"]').should('be.visible');
      cy.get('input[placeholder="Mennyiség"]').should('be.visible');
      cy.get('#unit').should('be.visible');
      cy.get('.add-ingredient-button').should('be.visible');
      cy.get('.search-recipes-button').should('be.visible');
      cy.get('input[placeholder="A hozzávalók %-val szűrés"]').should('be.visible');
    });
  
    it('Hozzávalót ad a hűtőlistához és megjelenik a listában', () => {
      cy.wait('@getIngredients');
  
      cy.get('input[placeholder="Hozzávaló"]').type('Li');
      cy.get('.autocomplete-list li').contains('Liszt').click();
      cy.wait('@getUnitsForLiszt');
  
      cy.get('input[placeholder="Mennyiség"]').type('250');
      cy.get('#unit').select('g');
      cy.get('.add-ingredient-button').click();
  
      cy.get('.fridge-list li').should('contain.text', 'Liszt - 250 g');
    });
  
    it('Hozzávalót távolít el a hűtőlistából', () => {
      cy.wait('@getIngredients');
  
      cy.get('input[placeholder="Hozzávaló"]').type('Li');
      cy.get('.autocomplete-list li').contains('Liszt').click();
      cy.wait('@getUnitsForLiszt');
  
      cy.get('input[placeholder="Mennyiség"]').type('250');
      cy.get('#unit').select('g');
      cy.get('.add-ingredient-button').click();
  
      cy.get('.fridge-list li').should('contain.text', 'Liszt - 250 g');
      cy.get('.fridge-list li .removeImage').click();
      cy.get('.fridge-list li').should('not.exist');
    });
  
    it('Recepteket keres a hűtő tartalma alapján', () => {
      cy.wait('@getIngredients');
  
      // Hozzávalók hozzáadása a hűtőhöz
      cy.get('input[placeholder="Hozzávaló"]').type('Li');
      cy.get('.autocomplete-list li').contains('Liszt').click();
      cy.wait('@getUnitsForLiszt');
      cy.get('input[placeholder="Mennyiség"]').type('250');
      cy.get('#unit').select('g');
      cy.get('.add-ingredient-button').click();
  
      cy.get('input[placeholder="Hozzávaló"]').type('Cukor');
      cy.get('.autocomplete-list li').contains('Cukor').click();
      cy.wait('@getUnitsForCukor');
      cy.get('input[placeholder="Mennyiség"]').type('60');
      cy.get('#unit').select('g');
      cy.get('.add-ingredient-button').click();
  
      cy.get('input[placeholder="Hozzávaló"]').type('Tojás');
      cy.get('.autocomplete-list li').contains('Tojás').click();
      cy.wait('@getUnitsForTojas');
      cy.get('input[placeholder="Mennyiség"]').type('3');
      cy.get('#unit').select('db');
      cy.get('.add-ingredient-button').click();
  
      // Keresés
      cy.get('.search-recipes-button').click();
  
      cy.wait('@getIngredientsForRecipe1');
      cy.wait('@getIngredientsForRecipe2');
      cy.wait('@unitConversion').its('request.body').should('deep.equal', {
        mibol: 'g',
        mibe: 'g',
        mennyiseg: 200,
      });
  
      // Ellenőrizzük, hogy a megfelelő receptek megjelennek
      cy.get('.blog-grid .blog-item').should('have.length', 1);
      cy.get('.blog-item').eq(0).find('h2').should('have.text', 'Teszt Recept 1');
  
      // Ellenőrizzük az értékeléseket
      cy.get('.blog-item').eq(0).find('.star-rating .star.filled').should('have.length', 5); // 4.5 kerekítve 5
    });
  
    it('Szűri a recepteket a százalékos érték alapján', () => {
      cy.wait('@getIngredients');
  
      // Hozzávalók hozzáadása a hűtőhöz
      cy.get('input[placeholder="Hozzávaló"]').type('Li');
      cy.get('.autocomplete-list li').contains('Liszt').click();
      cy.wait('@getUnitsForLiszt');
      cy.get('input[placeholder="Mennyiség"]').type('250');
      cy.get('#unit').select('g');
      cy.get('.add-ingredient-button').click();
  
      // Szűrési százalék 50%-ra állítása
      cy.get('#percentage').clear().type('50');
      cy.get('.search-recipes-button').click();
  
      cy.wait('@getIngredientsForRecipe1');
      cy.wait('@getIngredientsForRecipe2');
  
      // Teszt Recept 1: 1/3 hozzávaló megvan (33%) -> nem jelenik meg
      // Teszt Recept 2: 1/2 hozzávaló megvan (50%) -> megjelenik
      cy.get('.blog-grid .blog-item').should('have.length', 1);
      cy.get('.blog-item').eq(0).find('h2').should('have.text', 'Teszt Recept 2');
    });
  
    it('Navigál a recept részletei oldalra kattintás után', () => {
      cy.wait('@getIngredients');
  
      cy.get('input[placeholder="Hozzávaló"]').type('Li');
      cy.get('.autocomplete-list li').contains('Liszt').click();
      cy.wait('@getUnitsForLiszt');
      cy.get('input[placeholder="Mennyiség"]').type('250');
      cy.get('#unit').select('g');
      cy.get('.add-ingredient-button').click();
  
      // Szűrési százalék 0%-ra állítása, hogy minden recept megjelenjen
      cy.get('#percentage').clear().type('0');
      cy.get('.search-recipes-button').click();
  
      cy.wait('@getIngredientsForRecipe1');
      cy.wait('@getIngredientsForRecipe2');
  
      cy.get('.blog-grid .blog-item').should('have.length', 2);
      cy.get('.blog-item').eq(0).click();
      cy.url().should('eq', 'http://localhost:3000/recipeDetails/1');
    });
  
    it('Hibát jelez, ha a receptek lekérdezése sikertelen', () => {
      cy.intercept('GET', 'https://localhost:44350/api/Recept', {
        statusCode: 500,
        body: { error: 'Szerver hiba történt.' },
      }).as('getRecipes');
  
      cy.visit('http://localhost:3000/fridge');
      cy.wait('@getRecipes');
  
      cy.get('p').should('have.text', 'Hiba a receptek lekérdezése során.');
    });
  
    it('Hibát jelez, ha a mértékegységek lekérdezése sikertelen', () => {
      cy.wait('@getIngredients');
  
      cy.intercept('GET', 'https://localhost:44350/api/Mertekegyseg_Hozzavalo/1', {
        statusCode: 500,
        body: { error: 'Szerver hiba történt.' },
      }).as('getUnitsForLiszt');
  
      cy.get('input[placeholder="Hozzávaló"]').type('Li');
      cy.get('.autocomplete-list li').contains('Liszt').click();
      cy.wait('@getUnitsForLiszt');
  
      cy.get('#unit').find('option').should('have.length', 1); // Csak a placeholder opció marad
      cy.get('#unit option').should('have.text', 'Válassz mértékegységet');
    });
  
    it('Nem talál receptet, ha a hűtő tartalma nem elég', () => {
      cy.wait('@getIngredients');
  
      // Csak egy olyan hozzávalót adunk hozzá, ami egyik receptben sincs
      cy.get('input[placeholder="Hozzávaló"]').type('Só');
      cy.get('.autocomplete-list li').contains('Só').click();
      cy.wait('@getUnitsForSo');
      cy.get('input[placeholder="Mennyiség"]').type('5');
      cy.get('#unit').select('g');
      cy.get('.add-ingredient-button').click();
  
      cy.get('#percentage').clear().type('100');
      cy.get('.search-recipes-button').click();
  
      cy.wait('@getIngredientsForRecipe1');
      cy.wait('@getIngredientsForRecipe2');
  
      cy.get('p').should('have.text', 'Sajnos nem találtunk megfelelő receptet');
    });
  });