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
    public class TestReceptHozzavaloController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllReceptHozzavalo()
        {
            var ctx = new TestReceptContext();
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(0));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(1));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(2));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(3));

            var controller = new Recept_HozzavaloController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ReceptHozzavaloModel> contentResult));
  

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameReceptHozzavalo()
        {
            var ctx = new TestReceptContext();
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(0));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(1));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(2));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(3));

            var controller = new Recept_HozzavaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ReceptHozzavaloModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameReceptHozzavalo()
        {
            var ctx = new TestReceptContext();
            var controller = new Recept_HozzavaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(0));
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(0));
            ctx.Receptek.Add(dc.ReceptDemos(0));
            var postResponse= await controller.Post(new ReceptHozzavaloPostModel
            {
                Mennyiseg=1,
                MertekegysegNeve="Demo0",
                HozzavaloNev="Demo0",
                R_id=1
            }).ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(postResponse.IsSuccessStatusCode);

            //var response = controller.Get();
            //var contentResult = response as OkNegotiatedContentResult<List<ReceptHozzavaloModel>>;

            //Assert.IsNotNull(contentResult);
            //Assert.AreEqual(1, contentResult.Content[contentResult.Content.Count - 1].Mennyiseg);

        }

        [TestMethod]
        public void Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(0));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(1));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(2));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(3));

            var controller = new Recept_HozzavaloController(ctx);

            controller.Put(2,"Demo1", new ReceptHozzavaloPutModel
            {
                Mennyiseg = 100
            });
            var response = controller.Get(2);
            var contentResult = response as OkNegotiatedContentResult<List<ReceptHozzavaloModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(100, contentResult.Content[0].Mennyiseg);

        }

        [TestMethod]
        public void Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(0));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(0));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(1));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(2));
            ctx.Recept_Hozzavalok.Add(dc.Recept_HozzavaloDemos(3));

            var controller = new Recept_HozzavaloController(ctx);

            controller.Delete(1,"Demo0");
            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<ReceptHozzavaloModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Content.Count());

        }


    }
}
