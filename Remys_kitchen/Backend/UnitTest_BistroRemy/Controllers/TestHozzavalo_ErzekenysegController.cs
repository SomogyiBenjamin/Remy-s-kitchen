using BistroRemy.Controllers;
using BistroRemy.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using static BistroRemy.Controllers.Hozzavalo_ErzekenysegController;

namespace UnitTest_BistroRemy
{
    [TestClass]
    public class TestHozzavalo_ErzekenysegController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_WhenHasItems_ReturnsOkWithList()
        {
            // Arrange
            var ctx = new TestReceptContext();

            var hozzavalo = new Hozzavalo { Hid = 1, Nev = "Buzaliszt" };
            var erzekenyseg = new Erzekenyseg { Eid = 1, Nev = "Gluten" };

            ctx.Hozzavalok.Add(hozzavalo);
            ctx.Erzekenysegek.Add(erzekenyseg);

            var hozzavaloErzekenyseg = new Hozzavalo_Erzekenyseg
            {
                E_id = 1,
                H_id = 1,
                Hozzavalo = hozzavalo, // Navigációs tulajdonság beállítása
                Erzekenyseg = erzekenyseg // Navigációs tulajdonság beállítása
            };
            ctx.Hozzavalo_Erzekenysegek.Add(hozzavaloErzekenyseg);
            ctx.SaveChanges();

            // Ellenőrzés
            var heItem = ctx.Hozzavalo_Erzekenysegek.First();
            Assert.IsNotNull(heItem.Hozzavalo, "A Hozzavalo navigációs tulajdonság null.");
            Assert.IsNotNull(heItem.Erzekenyseg, "Az Erzekenyseg navigációs tulajdonság null.");

            var controller = new Hozzavalo_ErzekenysegController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            // Act
            var result = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());

            // Assert
            Assert.IsTrue(result.IsSuccessStatusCode);
            Assert.IsTrue(result.TryGetContentValue(out List<HozzavaloErzekenysegModel> contentResult));
            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
            Assert.AreEqual("Buzaliszt", contentResult[0].HozzavaloNev);
            Assert.AreEqual("Gluten", contentResult[0].ErzekenysegNev);
        }
    }
}
