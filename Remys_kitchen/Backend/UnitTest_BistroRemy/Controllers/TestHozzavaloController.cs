using BistroRemy.Controllers;
using BistroRemy.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;


namespace UnitTest_BistroRemy
{
    [TestClass]
    public class TestHozzavaloController
    {
        DemosClass dc = new DemosClass();

        [TestMethod]
        public async Task Get_ShouldReturnAllHozzavalo()
        {
            var ctx = new TestReceptContext();
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(0));
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(1));
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(2));

            var controller = new HozzavaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };


            var result = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(result.IsSuccessStatusCode);
            Assert.IsTrue(result.TryGetContentValue(out List<HozzavaloModel> contentResult));
            //var contentResult = result.Content; // as OkNegotiatedContentResult<List<ErtekelesModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Count);



        }
        [TestMethod]
        public async Task Get_ShouldReturnSameHozzavalo()
        {
            // Arrange
            var ctx = new TestReceptContext();
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(0));
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(1));
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(2));
            ctx.SaveChanges();

            var controller = new HozzavaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            // Act
            var response = await controller.Get(1).ExecuteAsync(new System.Threading.CancellationToken());

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<HozzavaloModel> contentResult));


            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
            Assert.AreEqual("Demo0", contentResult[0].Nev);
        }


        [TestMethod]
        public async Task Post_ShouldReturnSameHozzavalo()
        {
            var ctx = new TestReceptContext();

            // Előre felvitt elemek mentése
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(0));
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(1));
            ctx.SaveChanges();

            var controller = new HozzavaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            // Post kérés
            var postResponse = await controller.Post(new HozzavaloPostModel
            {
                Nev = "DemoHozzavalo"
            }).ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(postResponse.IsSuccessStatusCode);

            //Assert.AreEqual(HttpStatusCode.OK, postResponse.StatusCode);

            //// Get kérés
            //var getResponse = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            //Assert.IsTrue(getResponse.IsSuccessStatusCode);
            //Assert.IsTrue(getResponse.TryGetContentValue(out List<HozzavaloModel> contentResult));

            //Assert.IsNotNull(contentResult);
            //Assert.AreEqual(3, contentResult.Count);

            //// Ellenőrizd, hogy a DemoHozzavalo benne van-e
            //Assert.IsTrue(contentResult.Any(h => h.Nev == "DemoHozzavalo"));
        }


        //[TestMethod]
        //public async Task Post_ShouldReturnSameHozzavalo()
        //{
        //    // Arrange
        //    var ctx = new TestReceptContext();
        //    ctx.Hozzavalok.Add(dc.HozzavaloDemos(0)); // Hid = 1
        //    ctx.Hozzavalok.Add(dc.HozzavaloDemos(1)); // Hid = 2
        //    ctx.SaveChanges();
        //    Console.WriteLine($"Hozzavalok száma inicializálás után: {ctx.Hozzavalok.Count()}");

        //    var controller = new HozzavaloController(ctx)
        //    {
        //        Request = new HttpRequestMessage(),
        //        Configuration = new HttpConfiguration()
        //    };

        //    // Act: Post
        //    var postResponse = await controller.Post(new HozzavaloPostModel { Nev = "DemoHozzavalo" }).ExecuteAsync(CancellationToken.None);
        //    Console.WriteLine($"Hozzavalok száma Post után: {ctx.Hozzavalok?.Count() ?? -1}");
        //    Console.WriteLine($"Post StatusCode: {postResponse.StatusCode}");

        //    // Assert: Post
        //    Assert.IsTrue(postResponse.IsSuccessStatusCode, "A Post-nak sikeresnek kell lennie.");
        //    Assert.AreEqual(HttpStatusCode.OK, postResponse.StatusCode, "A Post-nak OK (200)-t kell visszaadnia.");

        //    // Act: Get
        //    Console.WriteLine($"Hozzavalok száma Get előtt: {ctx.Hozzavalok?.Count() ?? -1}");
        //    var getResponse = await controller.Get(3).ExecuteAsync(CancellationToken.None);

        //    // Assert: Get
        //    Assert.IsTrue(getResponse.IsSuccessStatusCode, "A Get-nek sikeresnek kell lennie.");
        //    Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode, "A Get-nek OK (200)-t kell visszaadnia.");
        //    Assert.IsTrue(getResponse.TryGetContentValue(out HozzavaloModel contentResult), "A Get-nek List<HozzavaloModel>-t kell visszaadnia.");

        //    Assert.IsNotNull(contentResult, "A contentResult nem lehet null.");
        //    Assert.AreEqual("DemoHozzavalo", contentResult.Nev, "Három hozzávalónak kell lennie.");
        //    Console.WriteLine($"ContentResult: {JsonConvert.SerializeObject(contentResult)}");
        //}


        [TestMethod]
        public async Task Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();


            ctx.Hozzavalok.Add(dc.HozzavaloDemos(1)); // Ertid = 2
            ctx.Hozzavalok.Add(dc.HozzavaloDemos(1)); // Ertid = 2
            ctx.SaveChanges();

            var controller = new HozzavaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            var deleteResponse = controller.Delete(2);
            Assert.IsTrue(deleteResponse is OkResult);


            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<HozzavaloModel> contentResult));
            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }


    }
}
