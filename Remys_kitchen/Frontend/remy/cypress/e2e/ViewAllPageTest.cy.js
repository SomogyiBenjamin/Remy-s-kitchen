describe('ViewAll Functionality', () => {
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 2,
    Erzekeny: '',
    ProfilkepURL: ''
  };

  const mockRecipes = [
    {
      Rid: 1,
      Nev: 'Csirkepaprikás',
      Allapot: 1,
      Eperc: 60,
      HozzavaloDb: 5,
      Leiras: 'Hagyományos magyar csirkepaprikás.',
      KategoriaNev: 'Főétel'
    },
    {
      Rid: 2,
      Nev: 'Gluténmentes pizza',
      Allapot: 1,
      Eperc: 45,
      HozzavaloDb: 8,
      Leiras: 'Gluténmentes pizza otthoni elkészítéshez.',
      KategoriaNev: 'Főétel'
    },
    {
      Rid: 3,
      Nev: 'Vegán brownie',
      Allapot: 1,
      Eperc: 30,
      HozzavaloDb: 6,
      Leiras: 'Finom vegán brownie csokival.',
      KategoriaNev: 'Desszert'
    }
  ];

  const mockImages = [
    { URL: 'csirkepaprikas.jpg' },
    { URL: 'glutenmentes_pizza.jpg' },
    { URL: 'vegan_brownie.jpg' }
  ];

  const mockRecipeTags = [
    { R_id: 1, TagNev: 'Magyaros' },
    { R_id: 2, TagNev: 'Gluténmentes' },
    { R_id: 3, TagNev: 'Vegán' },
    { R_id: 3, TagNev: 'Csokis' }
  ];

  const mockTags = [
    { Tid: 1, Nev: 'Magyaros' },
    { Tid: 7, Nev: 'Édes' },
    { Tid: 10, Nev: 'Gluténmentes' },
    { Tid: 19, Nev: 'Vegán' }
  ];

  const mockCategories = [
    { Kid: 1, Nev: 'Főétel' },
    { Kid: 2, Nev: 'Desszert' }
  ];

  const mockRatings = [
    { ReceptId: 1, Csillag: 4 },
    { ReceptId: 1, Csillag: 5 },
    { ReceptId: 2, Csillag: 3 },
    { ReceptId: 3, Csillag: 5 }
  ];

  const mockIngredients = [
    { R_id: 1, HozzavaloNev: 'Csirke' },
    { R_id: 1, HozzavaloNev: 'Paprika' },
    { R_id: 2, HozzavaloNev: 'Gluténmentes liszt' },
    { R_id: 2, HozzavaloNev: 'Sajt' },
    { R_id: 3, HozzavaloNev: 'Csokoládé' },
    { R_id: 3, HozzavaloNev: 'Növényi tej' }
  ];

  const mockUserSensitivities = [
    { E_id: 1, ErzekenysegNev: 'Tej' }
  ];

  const mockSensitivityDetails = [
    { HozzavaloNev: 'Sajt' },
    { HozzavaloNev: 'Növényi tej' }
  ];

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
      win.localStorage.setItem('user', JSON.stringify(mockUser));
    });

    cy.intercept('GET', 'https://localhost:44350/api/Recept', {
      statusCode: 200,
      body: mockRecipes
    }).as('getRecipes');

    mockRecipes.forEach((recipe, index) => {
      cy.intercept('GET', `https://localhost:44350/api/Multimedia/${recipe.Rid}`, {
        statusCode: 200,
        body: [mockImages[index]]
      }).as(`getImage${recipe.Rid}`);
    });

    cy.intercept('GET', 'https://localhost:44350/api/Recept_Hozzavalo', {
      statusCode: 200,
      body: mockIngredients
    }).as('getIngredients');

    cy.intercept('GET', 'https://localhost:44350/api/Recept_Tag', {
      statusCode: 200,
      body: mockRecipeTags
    }).as('getRecipeTags');

    cy.intercept('GET', 'https://localhost:44350/api/Tag', {
      statusCode: 200,
      body: mockTags
    }).as('getTags');

    cy.intercept('GET', 'https://localhost:44350/api/Kategoria', {
      statusCode: 200,
      body: mockCategories
    }).as('getCategories');

    cy.intercept('GET', 'https://localhost:44350/api/Ertekeles', {
      statusCode: 200,
      body: mockRatings
    }).as('getRatings');

    cy.intercept('GET', `https://localhost:44350/api/Felhasznalo_Erzekenyseg/${mockUser.id}`, {
      statusCode: 200,
      body: mockUserSensitivities
    }).as('getUserSensitivities');

    mockUserSensitivities.forEach((sensitivity) => {
      cy.intercept('GET', `https://localhost:44350/api/Hozzavalo_Erzekenyseg/${sensitivity.E_id}`, {
        statusCode: 200,
        body: mockSensitivityDetails
      }).as(`getSensitivityDetails${sensitivity.E_id}`);
    });

    cy.visit('http://localhost:3000/viewAll');
  });

  it('Ellenőrzi, hogy a receptek megjelennek', () => {
    cy.get('h1.viewallmaintitle').contains('Összes recept').should('be.visible');
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3']);
    cy.wait('@getIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    cy.get('.blog-grid-view .blog-item').should('have.length', 1);
    cy.get('.blog-grid-view .blog-item').contains('Csirkepaprikás').should('be.visible');
  });

  it('Keresés a receptek között', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3']);
    cy.wait('@getIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    cy.get('.sensitivityButton').click();
    cy.get('.search-input').type('pizza');
    cy.get('.blog-grid-view .blog-item').should('have.length', 1);
    cy.get('.blog-grid-view .blog-item').contains('Gluténmentes pizza').should('be.visible');
  });

  it('Szűrés tag alapján', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3']);
    cy.wait('@getIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    cy.get('.sensitivityButton').click();
    cy.get('.tag-select').select('Gluténmentes');
    cy.get('.blog-grid-view .blog-item').should('have.length', 1);
    cy.get('.blog-grid-view .blog-item').contains('Gluténmentes pizza').should('be.visible');
  });

  it('Szűrés kategória alapján', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3']);
    cy.wait('@getIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    cy.get('.sensitivityButton').click();
    cy.get('.category-select').select('Desszert');
    cy.get('.blog-grid-view .blog-item').should('have.length', 1);
    cy.get('.blog-grid-view .blog-item').contains('Vegán brownie').should('be.visible');
  });

  it('Érzékenységek szűrésének togglezése', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3']);
    cy.wait('@getIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    cy.get('.blog-grid-view .blog-item').should('have.length', 1);
    cy.get('.blog-grid-view .blog-item').contains('Csirkepaprikás').should('be.visible');

    cy.get('.sensitivityButton').click();
    cy.get('.blog-grid-view .blog-item').should('have.length', 3);
    cy.get('.blog-grid-view .blog-item').contains('Csirkepaprikás').should('be.visible');
    cy.get('.blog-grid-view .blog-item').contains('Gluténmentes pizza').should('be.visible');
    cy.get('.blog-grid-view .blog-item').contains('Vegán brownie').should('be.visible');
  });

  it('Pagináció működése', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3']);
    cy.wait('@getIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    const moreRecipes = [
      ...mockRecipes,
      { Rid: 4, Nev: 'Tésztasaláta', Allapot: 1, Eperc: 20, HozzavaloDb: 4, Leiras: 'Friss tésztasaláta.', KategoriaNev: 'Előétel' },
      { Rid: 5, Nev: 'Gyümölcsleves', Allapot: 1, Eperc: 25, HozzavaloDb: 3, Leiras: 'Hideg gyümölcsleves.', KategoriaNev: 'Leves' },
      { Rid: 6, Nev: 'Sült csirke', Allapot: 1, Eperc: 50, HozzavaloDb: 5, Leiras: 'Sült csirke zöldségekkel.', KategoriaNev: 'Főétel' },
      { Rid: 7, Nev: 'Saláta', Allapot: 1, Eperc: 15, HozzavaloDb: 3, Leiras: 'Friss saláta.', KategoriaNev: 'Előétel' }
    ];

    const moreIngredients = [
      ...mockIngredients,
      { R_id: 4, HozzavaloNev: 'Tészta' },
      { R_id: 5, HozzavaloNev: 'Gyümölcs' },
      { R_id: 6, HozzavaloNev: 'Csirke' },
      { R_id: 7, HozzavaloNev: 'Saláta' }
    ];

    cy.intercept('GET', 'https://localhost:44350/api/Recept', {
      statusCode: 200,
      body: moreRecipes
    }).as('getMoreRecipes');

    cy.intercept('GET', 'https://localhost:44350/api/Recept_Hozzavalo', {
      statusCode: 200,
      body: moreIngredients
    }).as('getMoreIngredients');

    moreRecipes.forEach((recipe, index) => {
      cy.intercept('GET', `https://localhost:44350/api/Multimedia/${recipe.Rid}`, {
        statusCode: 200,
        body: [{ URL: `${recipe.Nev.toLowerCase().replace(' ', '_')}.jpg` }]
      }).as(`getImage${recipe.Rid}`);
    });

    cy.visit('http://localhost:3000/viewAll');

    cy.wait('@getMoreRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3', '@getImage4', '@getImage5', '@getImage6', '@getImage7']);
    cy.wait('@getMoreIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    cy.get('.sensitivityButton').click();

    cy.get('.blog-grid-view .blog-item').should('have.length', 5);

    cy.get('.pagination-container').should('exist');
    cy.get('.pagination-container .pagination-button').contains('2').click();

    // Második oldalon 2 recept jelenik meg
    cy.get('.blog-grid-view .blog-item').should('have.length', 2);
    cy.get('.blog-grid-view .blog-item').contains('Sült csirke').should('be.visible');
    cy.get('.blog-grid-view .blog-item').contains('Saláta').should('be.visible');
    cy.get
  });

  it('Navigáció a recept részletei oldalra', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3']);
    cy.wait('@getIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    cy.get('.blog-grid-view .blog-item').contains('Csirkepaprikás').click();
    cy.url().should('eq', 'http://localhost:3000/recipeDetails/1');
  });

  it('Hiba kezelése, ha a receptek betöltése sikertelen', () => {
    cy.intercept('GET', 'https://localhost:44350/api/Recept', {
      statusCode: 500,
      body: {}
    }).as('getRecipes');

    cy.visit('http://localhost:3000/viewAll');

    cy.wait('@getRecipes');
    cy.get('p').contains('Hiba a receptek lekérdezése során.').should('be.visible');
  });

  it('Üzenet megjelenítése, ha nincs találat', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2', '@getImage3']);
    cy.wait('@getIngredients');
    cy.wait('@getRecipeTags');
    cy.wait('@getTags');
    cy.wait('@getCategories');
    cy.wait('@getRatings');
    cy.wait('@getUserSensitivities');
    cy.wait('@getSensitivityDetails1');

    cy.get('.search-input').type('Nem létező recept');
    cy.get('p').contains('Nem találhatóak receptek.').should('be.visible');
  });
});