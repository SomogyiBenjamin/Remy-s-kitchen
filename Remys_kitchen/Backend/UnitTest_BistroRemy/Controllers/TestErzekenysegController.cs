using BistroRemy.Controllers;
using BistroRemy.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
namespace UnitTest_BistroRemy
{
    [TestClass]
    public class TestErzekenysegController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllErzekenyseg()
        {
            var ctx = new TestReceptContext();
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(0));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(1));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(2));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(3));

            var controller = new ErzekenysegController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Erzekenyseg> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameErzekenyseg()
        {
            var ctx = new TestReceptContext();
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(0));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(1));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(2));

            var controller = new ErzekenysegController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Erzekenyseg> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameErzekenyseg()
        {
            var ctx = new TestReceptContext();
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(0));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(1));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(2));
            var controller = new ErzekenysegController(ctx) {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            controller.Post(new ErzekenysegPostModel
            {
                Eid=1,
                Nev="TesztErzekenyseg"
            });

            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
            //var contentResult = response as OkNegotiatedContentResult<List<Erzekenyseg>>;

            var response2 = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response2.IsSuccessStatusCode);
            Assert.IsTrue(response2.TryGetContentValue(out List<Erzekenyseg> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

            //Assert.IsNotNull(contentResult);
            //Assert.AreEqual("TesztErzekenyseg", contentResult.Content[contentResult.Content.Count - 1].Nev);

        }

        [TestMethod]
        public async Task Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new ErzekenysegController(ctx) {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(0));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(1));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(2));
            ctx.Erzekenysegek.Add(dc.ErzekenysegDemos(3));

            controller.Delete(1);
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Erzekenyseg> contentResult));
            //var contentResult = response as OkNegotiatedContentResult<List<Felhasznalo>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Count());

        }
    }
}
