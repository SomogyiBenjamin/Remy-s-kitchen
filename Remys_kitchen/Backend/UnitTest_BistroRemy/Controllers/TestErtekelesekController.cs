using BistroRemy.Controllers;
using BistroRemy.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace UnitTest_BistroRemy
{
    [TestClass]
    public class TestErtekelesekController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllErtekeles()
        {

            var ctx = new TestReceptContext();
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(0));

            var controller = new ErtekelesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            
            var result = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(result.IsSuccessStatusCode);
            Assert.IsTrue(result.TryGetContentValue(out List<ErtekelesModel> contentResult));
            //var contentResult = result.Content; // as OkNegotiatedContentResult<List<ErtekelesModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Get_ShouldReturnSameErtekeles()
        {
            var ctx = new TestReceptContext();
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(0));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(1));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(2));
            ctx.SaveChanges();

            var controller = new ErtekelesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ErtekelesModel> contentResult));
            //var contentResult = response as OkNegotiatedContentResult<ErtekelesModel>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }


        [TestMethod]
        public async Task Post_ShouldReturnSameErtekeles()
        {
            var ctx = new TestReceptContext();

            var demoErtekeles = dc.ErtekelesDemos(0);
            ctx.Receptek.Add(demoErtekeles.Recept);
            ctx.Felhasznalok.Add(demoErtekeles.Felhasznalo);
            demoErtekeles.Recept = demoErtekeles.Recept;
            demoErtekeles.Felhasznalo = demoErtekeles.Felhasznalo;
            ctx.Ertekelesek.Add(demoErtekeles);

            var controller = new ErtekelesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            // Act: Post
            var newErtekeles = new Ertekeles
            {
                Csillag = 2,
                R_id = 1,
                F_id = 1,
                Recept = demoErtekeles.Recept,
                Felhasznalo = demoErtekeles.Felhasznalo
            };
            var postResponse = await controller.Post(new ErtekelesPostModel
            {
                Csillag = 2,
                ReceptId = 1,
                FelhasznaloId = 1
            }).ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(postResponse.IsSuccessStatusCode);
            Assert.AreEqual(HttpStatusCode.OK, postResponse.StatusCode);

            var getResponse = await controller.Get().ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(getResponse.IsSuccessStatusCode);
            Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode);

            Assert.IsTrue(getResponse.TryGetContentValue(out List<ErtekelesModel> contentResult));
            Assert.IsNotNull(contentResult);
            Assert.AreEqual(2, contentResult.Count);
        }

        [TestMethod]
        public async Task Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();

            ctx.Ertekelesek.Add(dc.ErtekelesDemos(0));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(1));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(2));

            var controller = new ErtekelesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            controller.Put(1, new ErtekelesPostModel
            {
                Csillag = 5,
                ReceptId = 2,
                FelhasznaloId = 2
            });

            var response = await controller.Get(1).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ErtekelesModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);

        }


        [TestMethod]
        public async Task Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();


            ctx.Ertekelesek.Add(dc.ErtekelesDemos(1)); // Ertid = 2
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(1)); // Ertid = 2
            ctx.SaveChanges();

            var controller = new ErtekelesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            var deleteResponse = controller.Delete(2);
            Assert.IsTrue(deleteResponse is OkResult);


            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ErtekelesModel> contentResult));
            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }


    }
}
