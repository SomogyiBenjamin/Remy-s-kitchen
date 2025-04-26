using BistroRemy.Controllers;
using BistroRemy.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace UnitTest_BistroRemy
{
    [TestClass]
    public class TestMertekegyseg_HozzavaloController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllMertekegysegHozzavalo()
        {
            var ctx = new TestReceptContext();
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(0));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(1));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(2));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(3));

            var controller = new Mertekegyseg_HozzavaloController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Mertekegyseg_HozzavaloModel> contentResult));
        

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameMertekegysegHozzavalo()
        {
            var ctx = new TestReceptContext();
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(0));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(1));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(2));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(3));

            var controller = new Mertekegyseg_HozzavaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Mertekegyseg_HozzavaloModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameMertekegysegHozzavalo()
        {
            var ctx = new TestReceptContext();

            // Recept hozzáadása a kontextushoz
            ctx.Receptek.Add(new Recept { Rid = 1, Nev = "DemoRecept" });
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(3));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(0));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(1));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(0));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(1));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(2));
            ctx.SaveChanges();

            var controller = new Mertekegyseg_HozzavaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            // Post kérés
            var postResponse = await controller.Post(new MertekegysegHozzavaloPostModel
            {
                HozzavaloNev="Demo3",
                MertekegysegNev="Demo0,Demo1"

            }).ExecuteAsync(CancellationToken.None);

            // Ellenőrzés a Post válaszra
            Assert.IsTrue(postResponse.IsSuccessStatusCode);

            // Get kérés
            //var getResponse = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            //Assert.IsTrue(getResponse.IsSuccessStatusCode);
            //Assert.IsTrue(getResponse.TryGetContentValue(out List<Mertekegyseg_HozzavaloModel> contentResult));

            //Assert.IsNotNull(contentResult);
            //Assert.AreEqual(4, contentResult.Count);
            //Assert.AreEqual("Demo3", contentResult[contentResult.Count - 1].HozzavaloNev);

        }

        [TestMethod]
        public void Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new Mertekegyseg_HozzavaloController(ctx);
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(0));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(1));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(2));
            ctx.Mertekegyseg_Hozzavalok.Add(dc.Mertekegyseg_HozzavaloDemos(3));

            controller.Delete(1,1);
            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<Mertekegyseg_HozzavaloModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Content.Count());

        }

    }
}
