describe("Recipe Details Page", () => {
  const mockUser = {
    id: 19,
    Fnev: "Mate0609",
    Email: "damate0609@gmail.com",
    Jogosultsag: 1,
    ProfilkepURL: "testprofile.jpg",
  };

  const mockRecipe = {
    R_id: 1,
    Nev: "Teszt Recept",
    Leiras: "Ez egy teszt recept leírása.",
    KategoriaNev: "Desszert",
    Eperc: 30,
    Nehezseg: "Könnyű",
    image: "/asserts/kepek/recept1.jpg",
  };

  const mockSteps = [
    { Leiras: "Első lépés: keverd össze a hozzávalókat." },
    { Leiras: "Második lépés: süsd 20 percig." },
  ];

  const mockIngredients = [
    { HozzavaloNev: "Liszt", Mennyiseg: 200, Mertekegyseg: "g" },
    { HozzavaloNev: "Cukor", Mennyiseg: 100, Mertekegyseg: "g" },
  ];

  const mockRatings = [
    { FelhasznaloId: 19, Csillag: 4, Ertid: 1, ReceptId: 1 },
    { FelhasznaloId: 2, Csillag: 5, Ertid: 2, ReceptId: 1 },
  ];

  const mockTags = [
    { T_id: 1, TagNev: "Édes" },
    { T_id: 2, TagNev: "Sütemény" },
  ];

  beforeEach(() => {
    // Mockoljuk az API hívásokat
    cy.intercept("GET", "https://localhost:44350/api/Lepes/1", {
      statusCode: 200,
      body: mockSteps,
    }).as("getSteps");

    cy.intercept("GET", "https://localhost:44350/api/Recept_Hozzavalo/1", {
      statusCode: 200,
      body: mockIngredients,
    }).as("getIngredients");

    cy.intercept("GET", "https://localhost:44350/api/Ertekeles/1", {
      statusCode: 200,
      body: mockRatings,
    }).as("getRatings");

    cy.intercept("GET", "https://localhost:44350/api/Recept_Tag/1", {
      statusCode: 200,
      body: mockTags,
    }).as("getTags");

    cy.intercept("POST", "https://localhost:44350/api/Ertekeles", {
      statusCode: 200,
      body: { message: "Értékelés sikeresen beküldve!" },
    }).as("addRating");

    cy.intercept("PUT", "https://localhost:44350/api/Ertekeles/1", {
      statusCode: 200,
      body: { message: "Értékelés sikeresen frissítve!" },
    }).as("updateRating");
  });

  describe("Bejelentkezett felhasználóval", () => {
    beforeEach(() => {
      // Bejelentkezett felhasználó beállítása
      cy.window().then((win) => {
        win.localStorage.setItem("user", JSON.stringify(mockUser));
      });

      // Navigáljunk a recept részletei oldalra mockolt recipe objektummal
      cy.visit("http://localhost:3000/recipeDetails/", {
        state: { recipe: mockRecipe },
      });

      // Várjuk meg az API hívásokat
      cy.wait(["@getSteps", "@getIngredients", "@getRatings", "@getTags"]);
    });

    it("Megjeleníti a recept adatait", () => {
      cy.get(".recipe-header h1").should("have.text", "Teszt Recept");
      cy.get(".recipe-details p").should("have.text", "Ez egy teszt recept leírása.");
      cy.get(".recipe-image-large")
        .should("have.attr", "src")
        .and("include", "/asserts/kepek/recept1.jpg");

      // Egyéb információk
      cy.get("#categoryName").should("have.value", "Desszert");
      cy.get("#time").should("have.value", "30");
      cy.get("#defficultyName").should("have.value", "Könnyű");

      // Tag-ek
      cy.get(".AdminTagContainer .viewTagButton").should("have.length", 2);
      cy.get(".AdminTagContainer .viewTagButton").eq(0).should("have.text", "Édes");
      cy.get(".AdminTagContainer .viewTagButton").eq(1).should("have.text", "Sütemény");

      // Hozzávalók
      cy.get(".ulrecipedetails li").should("have.length", 2);
      cy.get(".ulrecipedetails li").eq(0).should("have.text", "Liszt - 200 g");
      cy.get(".ulrecipedetails li").eq(1).should("have.text", "Cukor - 100 g");

      // Lépések
      cy.get("ol li").should("have.length", 2);
      cy.get("ol li").eq(0).should("have.text", "Első lépés: keverd össze a hozzávalókat.");
      cy.get("ol li").eq(1).should("have.text", "Második lépés: süsd 20 percig.");
    });

    it("Megjeleníti az átlagos értékelést", () => {
      // A mockRatings alapján az átlagos értékelés: (4 + 5) / 2 = 4.5, kerekítve 5
      cy.get(".recipe-header .star-rating .star.filled").should("have.length", 5);
    });

    it("Lehetővé teszi az értékelés módosítását", () => {
      // A felhasználó már adott értékelést (4 csillag), ezt módosítjuk 3-ra
      cy.get(".user-star-rating .star.filled").should("have.length", 4);

      // Kattintsunk a 3. csillagra
      cy.get(".user-star-rating .star").eq(2).click();
      cy.get(".user-star-rating .star.filled").should("have.length", 3);

      // Küldés gombra kattintás
      cy.get(".user-star-rating .submit-button").contains("Módosítás").click();

      // Várjuk meg a PUT kérést
      cy.wait("@updateRating").then((interception) => {
        expect(interception.response.body.message).to.eq("Értékelés sikeresen frissítve!");
      });

      // Ellenőrizzük, hogy az API újratöltötte az értékeléseket
      cy.wait("@getRatings");
    });

    it("Navigál a /viewAll oldalra a 'Vissza a receptekhez' gombbal", () => {
      cy.get(".back-button").contains("Vissza a receptekhez").click();
      cy.url().should("eq", "http://localhost:3000/viewAll");
    });
  });

  describe("Bejelentkezés nélkül", () => {
    beforeEach(() => {
      // Töröljük a felhasználót a localStorage-ból
      cy.window().then((win) => {
        win.localStorage.removeItem("user");
      });

      // Navigáljunk a recept részletei oldalra
      cy.visit("/recipeDetails/1", {
        state: { recipe: mockRecipe },
      });

      // Várjuk meg az API hívásokat
      cy.wait(["@getSteps", "@getIngredients", "@getRatings", "@getTags"]);
    });

    it("Megjeleníti a modális ablakot értékelés beküldésekor", () => {
      // Kattintsunk a 4. csillagra
      cy.get(".user-star-rating .star").eq(3).click();
      cy.get(".user-star-rating .star.filled").should("have.length", 4);

      // Küldés gombra kattintás
      cy.get(".user-star-rating .submit-button").contains("Küldés").click();

      // Modális ablak ellenőrzése
      cy.get(".success-modal").should("be.visible");
      cy.get(".success-modal").contains("A funkció elérése megtagadva!").should("be.visible");
      cy.get(".success-modal").contains("Az oldalon néhány funkció csak regisztrált felhasználók számára elérhető.").should("be.visible");

      // "Megértettem" gombra kattintás
      cy.get(".success-modal button").contains("Megértettem").click();

      // Modális ablak eltűnik
      cy.get(".success-modal").should("not.exist");

      // Ellenőrizzük, hogy az URL nem változott
      cy.url().should("eq", "http://localhost:3000/recipeDetails/1");
    });
  });
});