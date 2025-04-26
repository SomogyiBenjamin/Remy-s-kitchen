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
    public class TestIzlesController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllIzles()
        {
            var ctx = new TestReceptContext();
            ctx.Izlesek.Add(dc.IzlesDemo(0));
            ctx.Izlesek.Add(dc.IzlesDemo(1));
            ctx.Izlesek.Add(dc.IzlesDemo(2));
            ctx.Izlesek.Add(dc.IzlesDemo(3));

            var controller = new IzlesController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Izles> contentResult));


            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameIzles()
        {
            var ctx = new TestReceptContext();
            ctx.Izlesek.Add(dc.IzlesDemo(0));
            ctx.Izlesek.Add(dc.IzlesDemo(1));
            ctx.Izlesek.Add(dc.IzlesDemo(2));
            ctx.Izlesek.Add(dc.IzlesDemo(3));

            var controller = new IzlesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Izles> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameIzles()
        {
            var ctx = new TestReceptContext();

            // Recept hozzáadása a kontextushoz
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(0));
            ctx.Tagek.Add(dc.TagDemos(0));
            ctx.SaveChanges();

            var controller = new IzlesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            // Post kérés
            var postResponse = await controller.Post(1, new IzlesPostmodel
            {
                TagNev = "Demo0"

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
        public async Task Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();

            var controller = new IzlesController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            ctx.Izlesek.Add(dc.IzlesDemo(0));
            ctx.Izlesek.Add(dc.IzlesDemo(1));
            ctx.Izlesek.Add(dc.IzlesDemo(2));
            ctx.Izlesek.Add(dc.IzlesDemo(3));

            var delete= await controller.Delete(1, 1).ExecuteAsync(CancellationToken.None);

            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());

           
            Assert.IsNotNull(response);
            Assert.IsTrue(delete.IsSuccessStatusCode);

        }


    }
}
