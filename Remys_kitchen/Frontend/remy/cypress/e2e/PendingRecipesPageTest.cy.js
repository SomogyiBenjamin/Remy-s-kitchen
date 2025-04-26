describe('PendingRecipes Functionality', () => {
  //Függőben lévő recept 1
  const mockRecipes = [
    {
      Rid: 1,
      Nev: 'Függőben lévő recept 1',
      Allapot: 0,
      Eperc: 60,
      HozzavaloDb: 5,
      Leiras: 'Ez egy függőben lévő recept.',
      KategoriaNev: 'Főétel'
    },
    //Függőben lévő recept 2
    {
      Rid: 2,
      Nev: 'Függőben lévő recept 2',
      Allapot: 0,
      Eperc: 45,
      HozzavaloDb: 8,
      Leiras: 'Ez egy másik függőben lévő recept.',
      KategoriaNev: 'Desszert'
    },
    // Már egy elfogadott recept
    {
      Rid: 3,
      Nev: 'Elfogadott recept',
      Allapot: 1, 
      Eperc: 30,
      HozzavaloDb: 6,
      Leiras: 'Ez egy elfogadott recept.',
      KategoriaNev: 'Előétel'
    }
  ];

  //Recept képek
  const mockImages = [
    { URL: 'fuggoben_recept1.jpg' },
    { URL: 'fuggoben_recept2.jpg' }
  ];

  beforeEach(() => {
    cy.intercept('GET', 'https://localhost:44350/api/Recept', {
      statusCode: 200,
      body: mockRecipes
    }).as('getRecipes');

    mockRecipes
      .filter(recipe => recipe.Allapot === 0)
      .forEach((recipe, index) => {
        cy.intercept('GET', `https://localhost:44350/api/Multimedia/${recipe.Rid}`, {
          statusCode: 200,
          body: [mockImages[index]]
        }).as(`getImage${recipe.Rid}`);
      });

    cy.visit('http://localhost:3000/pendingRecipes');
  });

  it('Ellenőrzi, hogy a függőben lévő receptek megjelennek', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2']);

    cy.get('.blog-grid .blog-item').should('have.length', 2);
    cy.get('.blog-grid .blog-item').contains('Függőben lévő recept 1').should('be.visible');
    cy.get('.blog-grid .blog-item').contains('Függőben lévő recept 2').should('be.visible');

    cy.get('.blog-grid .blog-item').contains('Elfogadott recept').should('not.exist');
  });

  it('Navigáció az admin recept részletei oldalra', () => {
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2']);

    cy.get('.blog-grid .blog-item').contains('Függőben lévő recept 1').click();
    cy.url().should('eq', 'http://localhost:3000/adminRecipeDetails/1');
  });

  it('Hiba kezelése, ha a receptek betöltése sikertelen', () => {
    cy.intercept('GET', 'https://localhost:44350/api/Recept', {
      statusCode: 500,
      body: {}
    }).as('getRecipesFailed');

    cy.visit('http://localhost:3000/pendingRecipes');

    cy.wait('@getRecipesFailed');
    cy.get('p').contains('Hiba a receptek lekérdezése során.').should('be.visible');
  });

  it('Üzenet megjelenítése, ha nincsenek függőben lévő receptek', () => {
    const noPendingRecipes = [
      {
        Rid: 3,
        Nev: 'Elfogadott recept',
        Allapot: 1,
        Eperc: 30,
        HozzavaloDb: 6,
        Leiras: 'Ez egy elfogadott recept.',
        KategoriaNev: 'Előétel'
      }
    ];

    cy.intercept('GET', 'https://localhost:44350/api/Recept', {
      statusCode: 200,
      body: noPendingRecipes
    }).as('getNoPendingRecipes');

    cy.visit('http://localhost:3000/pendingRecipes');

    cy.wait('@getNoPendingRecipes');
    cy.get('p').contains('Nem találhatóak receptek.').should('be.visible');
  });

  it('Reszponzív dizájn ellenőrzése', () => {
    cy.viewport('iphone-6');
    cy.wait('@getRecipes');
    cy.wait(['@getImage1', '@getImage2']);
    cy.get('.blog-grid .blog-item').should('have.length', 2);
  });
});