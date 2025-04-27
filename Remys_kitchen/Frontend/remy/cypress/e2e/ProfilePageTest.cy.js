describe('Profile Component', () => {
  beforeEach(() => {
    // Mock felhasználó adatai
    cy.window().then((win) => {
      win.localStorage.setItem('user', JSON.stringify({
        id: 1,
        Fnev: 'testuser',
        Email: 'test@example.com',
        ProfilkepURL: 'testprofile.jpg'
      }));
    });

    cy.intercept('GET', 'https://localhost:44350/api/Ertekeles', [
      { FelhasznaloId: 1, ReceptId: 1, Csillag: 5 },
      { FelhasznaloId: 1, ReceptId: 2, Csillag: 3 }
    ]).as('getRatings');

    cy.intercept('GET', 'https://localhost:44350/api/Recept/1', [
      { Rid: 1, Nev: 'Test Recipe 1', KategoriaNev: 'Dessert', FelhasznaloNev: 'testuser' }
    ]).as('getRecipe1');

    cy.intercept('GET', 'https://localhost:44350/api/Recept/2', [
      { Rid: 2, Nev: 'Test Recipe 2', KategoriaNev: 'Main Course', FelhasznaloNev: 'testuser' }
    ]).as('getRecipe2');

    cy.intercept('GET', 'https://localhost:44350/api/Multimedia/1', [
      { URL: 'recipe1.jpg' }
    ]).as('getImage1');

    cy.intercept('GET', 'https://localhost:44350/api/Multimedia/2', [
      { URL: 'recipe2.jpg' }
    ]).as('getImage2');

    cy.intercept('GET', 'https://localhost:44350/api/Recept', [
      { Rid: 1, Nev: 'Test Recipe 1', KategoriaNev: 'Dessert', FelhasznaloNev: 'testuser' },
      { Rid: 3, Nev: 'Test Recipe 3', KategoriaNev: 'Appetizer', FelhasznaloNev: 'testuser' }
    ]).as('getUserRecipes');

    cy.intercept('GET', 'https://localhost:44350/api/Multimedia/3', [
      { URL: 'recipe3.jpg' }
    ]).as('getImage3');

    cy.visit('http://localhost:3000/profile');
  });

  it('Helyesen jelennek meg a felhasználói információk', () => {
    cy.get('.profile-container').within(() => {
      cy.get('h1').should('have.text', 'Profil');
      cy.get('.user-info').within(() => {
        cy.get('img.profile-icon-img').should('have.attr', 'src').and('include', '/asserts/kepek/testprofile.jpg');
        cy.get('h2').should('have.text', 'testuser');
        cy.get('p').should('have.text', 'test@example.com');
        cy.get('.settings-icon').should('exist');
      });
    });
  });

  it('Értélés gombok helyes megjelenítése', () => {
    cy.wait(['@getRatings', '@getRecipe1', '@getRecipe2', '@getImage1', '@getImage2']);
    cy.get('.star-filter').within(() => {
      cy.get('.star-button').should('have.length', 5);
      cy.get('.star-button').eq(0).should('contain.text', '1 Csillag (0)');
      cy.get('.star-button').eq(2).should('contain.text', '3 Csillag (1)');
      cy.get('.star-button').eq(4).should('contain.text', '5 Csillag (1)');
    });
  });

  it('Recept(ek) megjelenítése az értékelés alapján', () => {
    cy.wait(['@getRatings', '@getRecipe1', '@getRecipe2', '@getImage1', '@getImage2']);
    cy.get('.star-button').contains('5 Csillag').click();
    cy.get('.selected-ratings').within(() => {
      cy.get('h3').should('have.text', '5 Csillagra értékelt receptek:');
      cy.get('.recipe-card').should('have.length', 1);
      cy.get('.recipe-card').within(() => {
        cy.get('img').should('have.attr', 'src').and('include', '/asserts/kepek/recipe1.jpg');
        cy.get('div').eq(0).should('have.text', 'Test Recipe 1');
        cy.get('div').eq(1).should('have.text', 'Kategória: Dessert');
      });
    });
  });

  it('Feltöltött receptek megjelenítése', () => {
    cy.wait(['@getUserRecipes', '@getImage1', '@getImage3']);
    cy.get('.uploaded-recipes').within(() => {
      cy.get('.recipe-card').should('have.length', 2);
      cy.get('.recipe-card').first().within(() => {
        cy.get('img').should('have.attr', 'src').and('include', '/asserts/kepek/recipe1.jpg');
        cy.get('div').eq(0).should('have.text', 'Test Recipe 1');
        cy.get('div').eq(1).should('have.text', 'Kategória: Dessert');
      });
      cy.get('.recipe-card').last().within(() => {
        cy.get('img').should('have.attr', 'src').and('include', '/asserts/kepek/recipe3.jpg');
        cy.get('div').eq(0).should('have.text', 'Test Recipe 3');
        cy.get('div').eq(1).should('have.text', 'Kategória: Appetizer');
      });
    });
  });


  it('Beállítások ablak megjelenítése a fogaskerék gomb megnyomásakor', () => {
    cy.get('.settings-icon').click();
    cy.get('.modal-content').should('be.visible');
  });

  it('A recept kártyájára való navigálás, ha rákattintunk a kártyára', () => {
    cy.wait(['@getUserRecipes', '@getImage1', '@getImage3']);
    cy.get('.uploaded-recipes .recipe-card').first().click();
    cy.url().should('include', '/recipeDetails/1');
  });
});