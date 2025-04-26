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
    public class TestLepesController
    {

        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllLepes()
        {
            var ctx = new TestReceptContext();
            ctx.Lepesek.Add(dc.LepesDemos(0));
            ctx.Lepesek.Add(dc.LepesDemos(1));
            ctx.Lepesek.Add(dc.LepesDemos(2));
            ctx.Lepesek.Add(dc.LepesDemos(3));

            var controller = new LepesController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<LepesModel> contentResult));
            //var contentResult = response as OkNegotiatedContentResult<List<Kategoria>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameLepes()
        {
            var ctx = new TestReceptContext();
            ctx.Lepesek.Add(dc.LepesDemos(0));
            ctx.Lepesek.Add(dc.LepesDemos(1));
            ctx.Lepesek.Add(dc.LepesDemos(2));

            var controller = new LepesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<LepesModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameLepes()
        {
            var ctx = new TestReceptContext();

            // Recept hozzáadása a kontextushoz
            ctx.Receptek.Add(new Recept { Rid = 1, Nev = "DemoRecept" });
            ctx.Lepesek.Add(dc.LepesDemos(0));
            ctx.Lepesek.Add(dc.LepesDemos(1));
            ctx.Lepesek.Add(dc.LepesDemos(2));
            ctx.SaveChanges();

            var controller = new LepesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            // Post kérés
            var postResponse = await controller.Post(new LepesPostModel
            {
                Sorszam = 2,
                Leiras = "DemoLeiras",
                R_id = 1
            }).ExecuteAsync(CancellationToken.None);

            // Ellenőrzés a Post válaszra
            Assert.IsTrue(postResponse.IsSuccessStatusCode);

            // Get kérés
            var getResponse = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(getResponse.IsSuccessStatusCode);
            Assert.IsTrue(getResponse.TryGetContentValue(out List<LepesModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count);
            Assert.AreEqual("DemoLeiras", contentResult[contentResult.Count - 1].Leiras);
        }

        [TestMethod]
        public async Task Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();
            var controller = new LepesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            ctx.Lepesek.Add(dc.LepesDemos(0));
            var lepes=ctx.Lepesek.Add(dc.LepesDemos(1));
            lepes.Sorszam = 1;
            ctx.Lepesek.Add(dc.LepesDemos(2));
            ctx.Lepesek.Add(dc.LepesDemos(3));
            var recept=ctx.Receptek.Add(dc.ReceptDemos(1));
            recept.Rid = 2;
            var PutResponse = await controller.Put(2, new LepesPutModel
            {
                Sorszam = 1,
                Leiras = "TesztLeiras"
            }).ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(PutResponse.IsSuccessStatusCode); ;


        }

        [TestMethod]
        public void Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new LepesController(ctx);
            ctx.Lepesek.Add(dc.LepesDemos(0));
            ctx.Lepesek.Add(dc.LepesDemos(1));
            ctx.Lepesek.Add(dc.LepesDemos(2));
            ctx.Lepesek.Add(dc.LepesDemos(3));

            controller.Delete(2);
            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<LepesModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Content.Count());

        }
    }
}
