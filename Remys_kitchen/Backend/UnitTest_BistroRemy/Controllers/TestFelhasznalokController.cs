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
    public class TestFelhasznalokController
    {

        DemosClass dc = new DemosClass();

        [TestMethod]
        public async Task Get_ShouldReturnAllFelhasznalo()
        {
            var ctx = new TestReceptContext();
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(0));
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(1));
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(2));

            var controller = new FelhasznaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Felhasznalo> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Count);

        }
        [TestMethod]
        public async Task Get_ShouldReturnSameFelhasznalo()
        {
            var ctx = new TestReceptContext();
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(0));
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(1));
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(2));

            var controller = new FelhasznaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2, "DemoEmailt", "Demo").ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out Felhasznalo contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("DemoEmailt", contentResult.Email);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameFelhasznalo()
        {
            var ctx = new TestReceptContext();
            var controller = new FelhasznaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            controller.Post(new FelhasznaloPostModel
            {
                Fnev = "Demo",
                Email = "asd",
                Jelszo = "asd",
                Jogosultsag = 1,
                Erzekeny = "dió",
                ProfilkepURL = "kepek/"
            });

            var response = await controller.Get().ExecuteAsync(CancellationToken.None);
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
            //var contentResult = response as OkNegotiatedContentResult<List<Felhasznalo>>;

            //Assert.IsNotNull(contentResult);
            //Assert.AreEqual("Demo", contentResult.Content[contentResult.Content.Count-1].Fnev);

        }

        [TestMethod]
        public async Task Put_SuccessfulUpdate_ReturnsOk()
        {
            var ctx = new TestReceptContext();

            var demoUser = dc.FelhasznaloDemo(2);
            ctx.Felhasznalok.Add(demoUser);

            var controller = new FelhasznaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            var updatedModel = new FelhasznaloPostModel
            {
                Fnev = "Updated",
                Email = "UpdatedEmail",
                Jelszo = "newpassword",
                Jogosultsag = 1,
                Erzekeny = "dió",
                ProfilkepURL = "kepek/profil"
            };
            var putResponse = await controller.Put(3, updatedModel).ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(putResponse.IsSuccessStatusCode);
            Assert.AreEqual(HttpStatusCode.OK, putResponse.StatusCode);

            var getResponse = await controller.Get(0, "UpdatedEmail", "newpassword").ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(getResponse.IsSuccessStatusCode);
            Assert.IsTrue(getResponse.TryGetContentValue(out Felhasznalo contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("Updated", contentResult.Fnev);
        }

        [TestMethod]
        public async Task Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new FelhasznaloController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(0));
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(1));
            ctx.Felhasznalok.Add(dc.FelhasznaloDemo(2));

            controller.Delete(3);
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Felhasznalo> contentResult));
            //var contentResult = response as OkNegotiatedContentResult<List<Felhasznalo>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(2, contentResult.Count());

        }


    }
}
