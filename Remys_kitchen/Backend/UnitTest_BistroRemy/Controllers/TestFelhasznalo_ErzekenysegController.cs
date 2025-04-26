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

namespace UnitTest_BistroRemy
{   
    [TestClass]
    public class TestFelhasznalo_ErzekenysegController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllFelhasznalo_Erzekenyseg()
        {
            var ctx = new TestReceptContext();
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(0));
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(1));
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(2));
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(3));

            var controller = new Felhasznalo_ErzekenysegController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<FelhasznaloErzekenysegModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameFelhasznaloErzekenyseg()
        {
            var ctx = new TestReceptContext();
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(0));
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(1));
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(2));

            var controller = new Felhasznalo_ErzekenysegController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<FelhasznaloErzekenysegModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        //Fix
        [TestMethod]
        public async Task Post_ShouldReturnSameFelhasznaloErzekenyseg()
        {
            var ctx = new TestReceptContext();
            var controller = new Felhasznalo_ErzekenysegController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(0));
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(0));
            
            controller.Post(new FelhasznaloErzekenysegPostModel
            {
                FelhasznaloId = 1,
                ErzekenysegNev = "DemoErzekenyseg"
            });

            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<FelhasznaloErzekenysegModel> contentResult));
            //var contentResult = response as OkNegotiatedContentResult<List<FelhasznaloErzekenysegModel>>;

            Assert.IsNotNull(contentResult);
            //Assert.AreEqual("DemoErzekenyseg", contentResult.Content[contentResult.Content.Count - 1].ErzekenysegNev);

        }

        [TestMethod]
        public async Task Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new Felhasznalo_ErzekenysegController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(0));
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(1));
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(2));
            ctx.Felhasznalo_Erzekenysegek.Add(dc.Felhasznalo_ErzekenysegDemos(3));



            controller.Delete("Demo0",1);
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<FelhasznaloErzekenysegModel> contentResult));
            //var contentResult = response as OkNegotiatedContentResult<List<FelhasznaloErzekenysegModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Count());

        }


    }
}
