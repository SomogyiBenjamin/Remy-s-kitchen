using BistroRemy.Controllers;
using BistroRemy.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace UnitTest_BistroRemy
{
    [TestClass]
    public class TestReceptekController
    {
        DemosClass dc = new DemosClass();

        [TestMethod]
        public async Task Get_ShouldReturnAllRecept()
        {
            var ctx = new TestReceptContext();


            var demo0 = dc.ReceptDemos(0);
            var demo1 = dc.ReceptDemos(1);
            var demo2 = dc.ReceptDemos(2);

            ctx.Receptek.Add(demo0);
            ctx.Receptek.Add(demo1);
            ctx.Receptek.Add(demo2);

            var controller = new ReceptController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            var response = await controller.Get().ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ReceptModel> contentResult));
            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Count);
        }
        [TestMethod]
        public async Task Get_ShouldReturnSameRecept()
        {
            var ctx = new TestReceptContext();

            var demo0 = dc.ReceptDemos(0);
            var demo1 = dc.ReceptDemos(1);
            var demo2 = dc.ReceptDemos(2);
            ctx.Receptek.Add(demo0);
            ctx.Receptek.Add(demo1);
            ctx.Receptek.Add(demo2);


            var controller = new ReceptController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            var response = await controller.Get(2).ExecuteAsync(CancellationToken.None);


            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ReceptModel> contentResult));
            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameRecept()
        {
            // Arrange
            var ctx = new TestReceptContext();
            ctx.Felhasznalok.Add(new Felhasznalo { Id = 1, Fnev = "Anna" });
            ctx.Kategoriak.Add(new Kategoria { Kid = 1, Nev = "Leves" });

            var controller = new ReceptController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            // Act: Post
            var postResponse = await controller.Post(new ReceptPostModel
            {
                Nev = "Demo",
                Leiras = "leiras",
                Szakmai = false,
                Eperc = 40,
                KategoriaNev = "Leves",
                FelhasznaloNev = "Anna",
                Nehezseg = "könnyű"
            }).ExecuteAsync(CancellationToken.None);

            // Assert: Post
            Assert.IsTrue(postResponse.IsSuccessStatusCode, "A Post-nak sikeresnek kell lennie.");
            Assert.AreEqual(HttpStatusCode.Created, postResponse.StatusCode, "A Post-nak Created (201)-et kell visszaadnia.");

            // Kinyerjük az új recept Rid-jét a Post válaszból (ha a Post visszaadja)
            int newReceptId = 1; // Ha a Post nem adja vissza az ID-t, feltételezzük az elsőt
            if (postResponse.TryGetContentValue(out Recept postResult))
            {
                newReceptId = postResult.Rid;
            }
            else
            {
                newReceptId = ctx.Receptek.Max(r => r.Rid); // Másik lehetőség
            }

            // Act: Get
            var getResponse = await controller.Get(newReceptId).ExecuteAsync(CancellationToken.None);

            // Assert: Get
            Assert.IsTrue(getResponse.IsSuccessStatusCode, "A Get-nek sikeresnek kell lennie.");
            Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode, "A Get-nek OK (200)-t kell visszaadnia.");
            Assert.IsTrue(getResponse.TryGetContentValue(out List<ReceptModel> contentResult), "A Get-nek List<ReceptModel>-t kell visszaadnia.");

            Assert.IsNotNull(contentResult, "A contentResult nem lehet null.");
            Assert.AreEqual(1, contentResult.Count, "Egy receptnek kell lennie.");
            Assert.AreEqual("Demo", contentResult[0].Nev, "A recept neve 'Demo' kell legyen.");
        }

        [TestMethod]
        public void Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();
            var controller = new ReceptController(ctx);
            ctx.Receptek.Add(dc.ReceptDemos(0));
            ctx.Receptek.Add(dc.ReceptDemos(1));
            ctx.Receptek.Add(dc.ReceptDemos(2));
            ctx.Receptek.Add(dc.ReceptDemos(3));

            controller.Put(1, new ReceptPutModel
            {
                Rid=1,
                Nev="Updated",
                Leiras="DemoLeiras",
                KategoriaNev="Demo1",
                FelhasznaloNev="Demo1",
                Allapot=3,
                Eperc=90,
                Szakmai=true,
                Nehezseg="Könnyű"
            });
            var response = controller.Get(1);
            var contentResult = response as OkNegotiatedContentResult<List<ReceptModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("Updated", contentResult.Content[0].Nev);

        }


        [TestMethod]
        public async Task Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new ReceptController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            ctx.Receptek.Add(dc.ReceptDemos(0));
            ctx.Receptek.Add(dc.ReceptDemos(1));
            ctx.Receptek.Add(dc.ReceptDemos(2));

            controller.Delete(2);
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);

        }
    }
}
