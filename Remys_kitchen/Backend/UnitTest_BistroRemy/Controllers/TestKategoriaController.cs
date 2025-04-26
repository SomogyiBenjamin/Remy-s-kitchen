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
    public class TestKategoriaController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllKategoria()
        {
            var ctx = new TestReceptContext();
            ctx.Kategoriak.Add(dc.KategoriaDemos(0));
            ctx.Kategoriak.Add(dc.KategoriaDemos(1));
            ctx.Kategoriak.Add(dc.KategoriaDemos(2));
            ctx.Kategoriak.Add(dc.KategoriaDemos(3));

            var controller = new KategoriaController(ctx) {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Kategoria> contentResult));
            //var contentResult = response as OkNegotiatedContentResult<List<Kategoria>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }
        [TestMethod]
        public async Task Get_ShouldReturnSameKategoria()
        {
            var ctx = new TestReceptContext();
            ctx.Kategoriak.Add(dc.KategoriaDemos(0));
            ctx.Kategoriak.Add(dc.KategoriaDemos(1));
            ctx.Kategoriak.Add(dc.KategoriaDemos(2));

            var controller = new KategoriaController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Kategoria> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public void Post_ShouldReturnSameKategoria()
        {
            var ctx = new TestReceptContext();
            var controller = new KategoriaController(ctx);
            controller.Post(new KategoriaPostModel
            {
                Nev = "Demo"
            });

            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<Kategoria>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("Demo", contentResult.Content[contentResult.Content.Count - 1].Nev);

        }

        [TestMethod]
        public void Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();
            var controller = new KategoriaController(ctx);
            ctx.Kategoriak.Add(dc.KategoriaDemos(0));
            ctx.Kategoriak.Add(dc.KategoriaDemos(1));
            ctx.Kategoriak.Add(dc.KategoriaDemos(2));
            ctx.Kategoriak.Add(dc.KategoriaDemos(3));

            controller.Put(4, new KategoriaPostModel
            {
                Nev = "Updated"
            });
            var response = controller.Get(4);
            var contentResult = response as OkNegotiatedContentResult<List<Kategoria>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("Updated", contentResult.Content[0].Nev);

        }

        [TestMethod]
        public void Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new KategoriaController(ctx);
            ctx.Kategoriak.Add(dc.KategoriaDemos(0));
            ctx.Kategoriak.Add(dc.KategoriaDemos(1));
            ctx.Kategoriak.Add(dc.KategoriaDemos(2));
            ctx.Kategoriak.Add(dc.KategoriaDemos(3));

            controller.Delete(4);
            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<Kategoria>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Content.Count());

        }


    }
}
