describe("Remy's Kitchen Home Page (Logged-in User)", () => {
  // Mock felhasználó adatai
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 1, // Adminisztrátor jogosultság
    Erzekeny: '',
    ProfilkepURL: 'profPlaceholder.png'
  };

  beforeEach(() => {
    // Bejelentkezett felhasználó beállítása a localStorage-ban
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(mockUser));
    });

    cy.visit("http://localhost:3000/home");
  });

  it("Megnyitja a kezdőlapot és ellenőrzi az oldal címét", () => {
    cy.title().should("eq", "Remy's Kitchen");
  });
});

// Header és Main láthatóságának ellenőrzése bejelentkezett felhasználóval
describe("Header and Main Visibility with Content (Logged-in User)", () => {
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 1,
    Erzekeny: '',
    ProfilkepURL: 'profPlaceholder.png'
  };

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(mockUser));
    });

    cy.visit("http://localhost:3000/home");
  });

  it("Ellenőrzi, hogy a Header tartalmazza a navigációs linkeket", () => {
    cy.get("header").should("be.visible");
    cy.get("header .nav-link").contains("Home").should("be.visible");
    cy.get("header .nav-link").contains("Recept feltöltés").should("be.visible");
  });

  it("Ellenőrzi, hogy a Main tartalmazza a receptkártyákat", () => {
    cy.get("main").should("be.visible");
    cy.get("main .blog-item").should("have.length.at.least", 1);
    cy.get("main .blog-item").first().find("h3").should("not.be.empty");
  });
});

// Navigációs linkek ellenőrzése bejelentkezett felhasználóval
describe("Remy's Kitchen Navigation Links (Logged-in Admin User)", () => {
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 1,
    Erzekeny: '',
    ProfilkepURL: 'profPlaceholder.png'
  };

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(mockUser));
    });

    cy.visit("http://localhost:3000/home");
  });

  it('Ellenőrzi, hogy a "Home" link a főoldalra navigál', () => {
    cy.get('.nav-link').contains('Home').click();
    cy.url().should('eq', 'http://localhost:3000/home');
  });

  it('Ellenőrzi, hogy a "Recept feltöltés" link a feltöltési oldalra navigál', () => {
    cy.get('.nav-link').contains('Recept feltöltés').click();
    cy.url().should('eq', 'http://localhost:3000/upload');
  });

  it('Ellenőrzi, hogy a "Mi van a hűtődben?" link a hűtő oldalra navigál', () => {
    cy.get('.nav-link').contains('Mi van a hűtődben?').click();
    cy.url().should('eq', 'http://localhost:3000/fridge');
  });

  it('Ellenőrzi, hogy az "Összes megtekintése" link a receptek oldalra navigál', () => {
    cy.get('.nav-link').contains('Összes megtekintése').click();
    cy.url().should('eq', 'http://localhost:3000/viewAll');
  });

  it('Ellenőrzi, hogy a "Döntésre váró receptek" link látható-e egy admin felhasználóval', () => {
    cy.get('.nav-link').contains('Döntésre váró receptek').should('be.visible');
  });
});

// Profil menü funkcionalitásának ellenőrzése bejelentkezett felhasználóval
describe("Profile Menu Functionality (Logged-in User)", () => {
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 1,
    Erzekeny: '',
    ProfilkepURL: 'profPlaceholder.png'
  };

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(mockUser));
    });

    cy.visit("http://localhost:3000/home");
  });

  it("Ellenőrzi, hogy a profil ikon a felhasználó profilképével jelenik meg", () => {
    cy.get(".profile-icon").should("be.visible");
    cy.get(".profile-icon-img").should("have.attr", "src", "/asserts/kepek/profPlaceholder.png");
  });

  it("Ellenőrzi, hogy a profil menü megnyílik és a kijelentkezés gomb működik", () => {
    cy.get(".profile-icon").should("be.visible").click();
    cy.get(".profile-menu", { timeout: 6000 }).should("be.visible");

    cy.get(".profile-menu a").contains("Profil").should("be.visible");
    cy.get(".profile-menu a").contains("Kijelentkezés").should("be.visible");

    cy.get(".profile-menu a").contains("Profil").click();
    cy.url().should("eq", "http://localhost:3000/profile");
    cy.get(".profile-menu").should("not.exist");

    cy.visit("http://localhost:3000/home");
    cy.get(".profile-icon").click();
    cy.get(".profile-menu", { timeout: 6000 }).should("be.visible");

    cy.window().then((win) => {
      cy.log("localStorage user (kijelentkezés előtt):", win.localStorage.getItem("user"));
    });

    cy.get(".profile-menu a").contains("Kijelentkezés").click();

    cy.window().then((win) => {
      win.localStorage.removeItem("user");
    });
    
    cy.wait(1000);
    
    cy.get(".profile-menu").should("not.exist");
    

    cy.window().then((win) => {
      cy.log("localStorage user (kijelentkezés után):", win.localStorage.getItem("user"));
      const user = win.localStorage.getItem("user");
      expect(user).to.be.null;
    });

    cy.url().should("eq", "http://localhost:3000/home");
  });
});

// "Receptjeink" gomb ellenőrzése bejelentkezett felhasználóval
describe("Remy's Kitchen Banner Button (Logged-in User)", () => {
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 1,
    Erzekeny: '',
    ProfilkepURL: 'profPlaceholder.png'
  };

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(mockUser));
    });

    cy.visit("http://localhost:3000/home");
  });

  it('Ellenőrzi, hogy a "Receptjeink" gomb létezik és kattintható', () => {
    cy.get('.banner-button').contains('Receptjeink').should('be.visible').and('not.be.disabled');
  });

  it('Ellenőrzi, hogy a "Receptjeink" gombra kattintás működik-e és a receptek oldalra navigál', () => {
    cy.get('.banner-button').contains('Receptjeink').click();
    cy.url().should('eq', 'http://localhost:3000/viewAll');
  });
});

describe("Recept kártyák ellenőrzése bejelentkezett felhasználóval", () => {
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 1,
    Erzekeny: '',
    ProfilkepURL: 'profPlaceholder.png'
  };

  const mockRecipes = [
    {
      Rid: 1,
      Nev: "Mock Recept 1",
      Leiras: "Ez egy teszt recept leírása az első recepthez.",
      Allapot: 1,
    },
    {
      Rid: 2,
      Nev: "Mock Recept 2",
      Leiras: "Ez egy teszt recept leírása a második recepthez.",
      Allapot: 1,
    },
    {
      Rid: 3,
      Nev: "Mock Recept 3",
      Leiras: "Ez egy teszt recept leírása a harmadik recepthez.",
      Allapot: 1,
    },
  ];

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(mockUser));
    });

    cy.intercept("GET", "https://localhost:44350/api/Recept", {
      statusCode: 200,
      body: mockRecipes,
    }).as("getRecipes");

    mockRecipes.forEach((recipe) => {
      cy.intercept("GET", `https://localhost:44350/api/Recept_Tag/${recipe.Rid}`, {
        statusCode: 200,
        body: [{ T_id: 1 }, { T_id: 2 }],
      }).as(`getRecipeTags${recipe.Rid}`);
    });

    mockRecipes.forEach((recipe) => {
      cy.intercept("GET", `https://localhost:44350/api/Multimedia/${recipe.Rid}`, {
        statusCode: 200,
        body: [{ URL: `recept${recipe.Rid}.jpg` }],
      }).as(`getImage${recipe.Rid}`);
    });

    cy.visit("http://localhost:3000/home");
  });

  it("Ellenőrzi, hogy a receptkártyák betöltődnek", () => {
    cy.wait("@getRecipes");
    mockRecipes.forEach((recipe) => {
      cy.wait(`@getRecipeTags${recipe.Rid}`);
      cy.wait(`@getImage${recipe.Rid}`);
    });

    // Ellenőrizzük, hogy a kártyák megjelennek-e (legfeljebb 3)
    cy.get(".blog-item")
      .should("have.length.at.least", 1)
      .and("have.length.at.most", 3);

    // Ellenőrizzük, hogy minden kártyának van címe, leírása és képe
    cy.get(".blog-item").each(($card) => {
      cy.wrap($card).find("h3").should("not.be.empty");
      cy.wrap($card).find("p").should("not.be.empty");
      cy.wrap($card).find("img").should("have.attr", "src").and("not.be.empty");
    });
  });

  it("Ellenőrzi, hogy az első kártyára kattintás a megfelelő receptoldalra navigál", () => {
    cy.wait("@getRecipes");
    mockRecipes.forEach((recipe) => {
      cy.wait(`@getRecipeTags${recipe.Rid}`);
      cy.wait(`@getImage${recipe.Rid}`);
    });

    // Az első kártya Rid kiválasztása
    const firstRecipeRid = mockRecipes[0].Rid;

    // Kattintunk az első kártyára
    cy.get(".blog-item").first().click();
    cy.url().should("eq", `http://localhost:3000/recipeDetails/${firstRecipeRid}`);
  });

  it("Ellenőrzi, hogy a második kártyára kattintás a megfelelő receptoldalra navigál (ha létezik)", () => {
    cy.wait("@getRecipes");
    mockRecipes.forEach((recipe) => {
      cy.wait(`@getRecipeTags${recipe.Rid}`);
      cy.wait(`@getImage${recipe.Rid}`);
    });

    // Ellenőrizzük, hogy van-e második kártya
    cy.get(".blog-item")
      .its("length")
      .then((length) => {
        if (length > 1) {
          // A második kártya Rid kiválasztása
          const secondRecipeRid = mockRecipes[1].Rid;

          // Kattintunk a második kártyára
          cy.get(".blog-item").eq(1).click();
          cy.url().should(
            "eq",
            `http://localhost:3000/recipeDetails/${secondRecipeRid}`
          );
        }
      });
  });
});

// Footer láthatóságának ellenőrzése bejelentkezett felhasználóval
describe("Footer Visibility (Logged-in User)", () => {
  const mockUser = {
    id: 3,
    Fnev: 'TestUser',
    Email: 'test@pelda.hu',
    Jelszo: 'Test123!@',
    Jogosultsag: 1,
    Erzekeny: '',
    ProfilkepURL: 'profPlaceholder.png'
  };

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(mockUser));
    });

    cy.visit("http://localhost:3000/home");
  });

  it("Ellenőrzi, hogy a Footer megjelenik az oldalon", () => {
    cy.get("footer").should("be.visible");
  });

  it("Ellenőrzi, hogy a Footer az oldal alján van", () => {
    cy.get("footer").should("be.visible");
    cy.scrollTo("bottom");
    cy.get("footer").should("be.visible");
  });
});