// Oldal címének ellenőrzése

describe('Remy\'s Kitchen Home Page', () => {
  it('Megnyitja a kezdőlapot és ellenőrzi az oldal címét', () => {
    cy.visit('http://localhost:3000/home');
    cy.title().should('eq', 'Remy\'s Kitchen');
  });
});

// Ellenőrzi, hogy a Header és a Main látható-e
describe('Header and Main Visibility with Content', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/home');
  });

  it('Ellenőrzi, hogy a Header tartalmazza a navigációs linkeket', () => {
    cy.get('header').should('be.visible');
    cy.get('header .nav-link').contains('Home').should('be.visible');
    cy.get('header .nav-link').contains('Recept feltöltés').should('be.visible');
  });

  it('Ellenőrzi, hogy a Main tartalmazza a receptkártyákat', () => {
    cy.get('main').should('be.visible');
    cy.get('main .blog-item').should('have.length.at.least', 1);
    cy.get('main .blog-item').first().find('h3').should('not.be.empty');
  });
});


//Navigation linkek ellenőrzése
describe('Remy\'s Kitchen Navigation Links (Default user)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/home');
  });

  it('Ellenőrzi, hogy a "Home" link a főoldalra navigál', () => {
    cy.get('.nav-link').contains('Home').click();
    cy.url().should('eq', 'http://localhost:3000/home');
  });

  it('Ellenőrzi, hogy a "Recept feltöltés" link modális ablakot nyit', () => {
    cy.get('.nav-link').contains('Recept feltöltés').click();
    cy.url().should('eq', 'http://localhost:3000/upload');
  });

  it('Ellenőrzi, hogy a "Mi van a hűtődben?" link a fridge oldalra navigál', () => {
    cy.get('.nav-link').contains('Mi van a hűtődben?').click();
    cy.url().should('eq', 'http://localhost:3000/fridge');
  });

  it('Ellenőrzi, hogy az "Összes megtekintése" link a viewAll oldalra navigál', () => {
    cy.get('.nav-link').contains('Összes megtekintése').click();
    cy.url().should('eq', 'http://localhost:3000/viewAll');
  });

  it('Ellenőrzi, hogy a "Döntésre váró receptek" link látható-e az alap felhasználóval', () => {
    cy.get('.nav-link').contains('Döntésre váró receptek').should('exist');
  });
});



// describe('Profile Menu Functionality', () => {
//   beforeEach(() => {
//     // Közvetlenül töröljük a localStorage-t a Cypress segítségével
//     cy.clearLocalStorage('user').then(() => {
//       cy.log('localStorage törölve');
//     });

//     // Ellenőrizzük, hogy a localStorage valóban üres-e
//     cy.window().then((win) => {
//       const user = win.localStorage.getItem('user');
//       cy.log('localStorage user (ellenőrzés):', user);
//       if (user !== null) {
//         throw new Error('A localStorage "user" kulcs nem null, pedig annak kellene lennie!');
//       }
//     });

//     // Mockolunk egy API-választ, ha az alkalmazás ellenőrzi a bejelentkezést
//     cy.intercept('GET', '**/api/auth*', {
//       statusCode: 401,
//       body: { message: 'Nem bejelentkezett' }
//     }).as('checkAuth');

//     cy.visit('http://localhost:3000/home');
//   });

//   it('Ellenőrzi, hogy a profil ikon megjelenik placeholder képpel bejelentkezés nélkül', () => {
//     cy.get('.profile-icon').should('be.visible');
//     cy.get('.profile-icon-img').should('have.attr', 'src', '/asserts/kepek/profPlaceholder.png');
//   });

//   it('Ellenőrzi, hogy a profil menü megnyílik, és a bejelentkezés/regisztráció linkek működnek', () => {
//     // Ellenőrizzük a localStorage állapotát közvetlenül a teszt előtt
//     cy.window().then((win) => {
//       cy.log('localStorage user (teszt előtt):', win.localStorage.getItem('user'));
//     });

//     cy.get('.profile-icon').should('be.visible').click();
//     cy.get('.profile-menu', { timeout: 6000 }).should('be.visible');

//     cy.get('.profile-menu').then(($menu) => {
//       cy.log('Profil menü tartalma:', $menu.text());
//     });

//     cy.get('.profile-menu a').contains('Bejelentkezés').should('be.visible');
//     cy.get('.profile-menu a').contains('Regisztráció').should('be.visible');

//     cy.get('.profile-menu a').contains('Bejelentkezés').click();
//     cy.url().should('eq', 'http://localhost:3000/log');
//     cy.get('.profile-menu').should('not.exist');

//     cy.visit('http://localhost:3000/home');
//     cy.get('.profile-icon').click();
//     cy.get('.profile-menu', { timeout: 6000 }).should('be.visible');
//     cy.get('.profile-menu a').contains('Regisztráció').click();
//     cy.url().should('eq', 'http://localhost:3000/reg');
//     cy.get('.profile-menu').should('not.exist');
//   });

//   it('Ellenőrzi, hogy a profil menü működik bejelentkezett felhasználóval', () => {
//     cy.window().then((win) => {
//       win.localStorage.setItem(
//         'user',
//         JSON.stringify({
//           id: 19,
//           Fnev: 'Mate0609',
//           Email: 'damate0609@gmail.com',
//           Jogosultsag: 1,
//           ProfilkepURL: 'testprofile.jpg'
//         })
//       );
//     });
//     cy.visit('http://localhost:3000/home');

//     cy.get('.profile-icon-img').should('have.attr', 'src', '/asserts/kepek/testprofile.jpg');

//     cy.get('.profile-icon').click();
//     cy.get('.profile-menu', { timeout: 6000 }).should('be.visible');

//     cy.get('.profile-menu a').contains('Profil').should('be.visible');
//     cy.get('.profile-menu a').contains('Kijelentkezés').should('be.visible');

//     cy.get('.profile-menu a').contains('Profil').click();
//     cy.url().should('eq', 'http://localhost:3000/profile');
//     cy.get('.profile-menu').should('not.exist');

//     cy.visit('http://localhost:3000/home');
//     cy.get('.profile-icon').click();
//     cy.get('.profile-menu', { timeout: 6000 }).should('be.visible');
//     cy.get('.profile-menu a').contains('Kijelentkezés').click();
//     cy.get('.profile-menu').should('not.exist');

//     cy.window().then((win) => {
//       const user = win.localStorage.getItem('user');
//       if (user !== null) {
//         throw new Error('A localStorage "user" kulcs nem null, pedig annak kellene lennie!');
//       }
//     });

//     cy.url().should('eq', 'http://localhost:3000/home');
//   });

//   it('Ellenőrzi, hogy a modális ablak megjelenik és működik', () => {
//     cy.get('.profile-icon').click();
//     cy.get('.profile-menu', { timeout: 6000 }).should('be.visible');
//     cy.get('.profile-menu a').contains('Bejelentkezés').click();

//     cy.window().then((win) => {
//       win.localStorage.setItem('isModalOpen', 'true');
//     });
//     cy.visit('http://localhost:3000/log');

//     cy.get('.success-modal').should('be.visible');
//     cy.get('.success-modal').contains('A funkció elérése megtagadva!').should('be.visible');
//     cy.get('.success-modal').contains('Az oldalon néhány funkció csak regisztrált felhasználók számára elérhető.').should('be.visible');
//     cy.get('.success-modal button').contains('Megértettem').click();

//     cy.get('.success-modal').should('not.exist');
//     cy.url().should('eq', 'http://localhost:3000/home');
//   });
// });

// A "Receptjeink" gomb ellenőrzése és navigáció a /viewAll oldalra
describe('Remy\'s Kitchen Banner Button', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/home');
  });

  it('Ellenőrzi, hogy a "Receptjeink" gomb létezik és kattintható', () => {
    cy.get('.banner-button').contains('Receptjeink').should('be.visible').and('not.be.disabled');
  });

  it('Ellenőrzi, hogy a "Receptjeink" gombra kattintás a /viewAll oldalra navigál', () => {
    cy.get('.banner-button').contains('Receptjeink').click();
    cy.url().should('eq', 'http://localhost:3000/viewAll');
  });
});


// A recept kártyák ellenőrzése a blog szekcióban
describe('Blog Section Recipe Cards (Dynamic)', () => {
  const mockRecipes = [
    {
      Rid: 1,
      Nev: 'Mock Recept 1',
      Leiras: 'Ez egy teszt recept leírása az első recepthez.',
      Allapot: 1
    },
    {
      Rid: 2,
      Nev: 'Mock Recept 2',
      Leiras: 'Ez egy teszt recept leírása a második recepthez.',
      Allapot: 1
    },
    {
      Rid: 3,
      Nev: 'Mock Recept 3',
      Leiras: 'Ez egy teszt recept leírása a harmadik recepthez.',
      Allapot: 1
    }
  ];

  beforeEach(() => {
    // Mockoljt adatok
    cy.intercept('GET', 'https://localhost:44350/api/Recept', {
      statusCode: 200,
      body: mockRecipes
    }).as('getRecipes');

    // Dinamikus Rid
    mockRecipes.forEach((recipe) => {
      cy.intercept('GET', `https://localhost:44350/api/Recept_Tag/${recipe.Rid}`, {
        statusCode: 200,
        body: [{ T_id: 1 }, { T_id: 2 }]
      }).as(`getRecipeTags${recipe.Rid}`);
    });


    mockRecipes.forEach((recipe) => {
      cy.intercept('GET', `https://localhost:44350/api/Multimedia/${recipe.Rid}`, {
        statusCode: 200,
        body: [{ URL: `recept${recipe.Rid}.jpg` }]
      }).as(`getImage${recipe.Rid}`);
    });

    cy.visit('http://localhost:3000/home');
  });

  it('Ellenőrzi, hogy a receptkártyák betöltődnek', () => {
    cy.wait('@getRecipes');
    mockRecipes.forEach((recipe) => {
      cy.wait(`@getRecipeTags${recipe.Rid}`);
      cy.wait(`@getImage${recipe.Rid}`);
    });

    // Ellenőrizzük, hogy a kártyák megjelennek (legfeljebb 3)
    cy.get('.blog-item').should('have.length.at.least', 1).and('have.length.at.most', 3);

    // Ellenőrizzük, hogy minden kártyának van címe, leírása és képe
    cy.get('.blog-item').each(($card) => {
      cy.wrap($card).find('h3').should('not.be.empty');
      cy.wrap($card).find('p').should('not.be.empty');
      cy.wrap($card).find('img').should('have.attr', 'src').and('not.be.empty');
    });
  });

  it('Ellenőrzi, hogy az első kártyára kattintás a megfelelő receptoldalra navigál', () => {
    cy.wait('@getRecipes');
    mockRecipes.forEach((recipe) => {
      cy.wait(`@getRecipeTags${recipe.Rid}`);
      cy.wait(`@getImage${recipe.Rid}`);
    });

    // Az első kártya Rid kiválasztása
    const firstRecipeRid = mockRecipes[0].Rid;

    // Kattintunk az első kártyára
    cy.get('.blog-item').first().click();
    cy.url().should('eq', `http://localhost:3000/recipeDetails/${firstRecipeRid}`);
  });

  it('Ellenőrzi, hogy a második kártyára kattintás a megfelelő receptoldalra navigál (ha létezik)', () => {
    cy.wait('@getRecipes');
    mockRecipes.forEach((recipe) => {
      cy.wait(`@getRecipeTags${recipe.Rid}`);
      cy.wait(`@getImage${recipe.Rid}`);
    });

    // Ellenőrizzük, hogy van-e második kártya
    cy.get('.blog-item').its('length').then((length) => {
      if (length > 1) {
        // A második kártya Rid kiválasztása
        const secondRecipeRid = mockRecipes[1].Rid;

        // Kattintunk a második kártyára
        cy.get('.blog-item').eq(1).click();
        cy.url().should('eq', `http://localhost:3000/recipeDetails/${secondRecipeRid}`);
      }
    });
  });
});


describe('Footer Visibility', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/home');
  });

  it('Ellenőrzi, hogy a Footer megjelenik az oldalon', () => {
    // Ellenőrizzük, hogy a Footer látható-e
    cy.get('footer').should('be.visible');
  });

  it('Ellenőrzi, hogy a Footer az oldal alján van', () => {
    // Ellenőrizzük, hogy a Footer az oldal alján helyezkedik el
    cy.get('footer').should('be.visible');

    // Görgetünk az oldal aljára, és ellenőrizzük, hogy a Footer még mindig látható
    cy.scrollTo('bottom');
    cy.get('footer').should('be.visible');
  });
});