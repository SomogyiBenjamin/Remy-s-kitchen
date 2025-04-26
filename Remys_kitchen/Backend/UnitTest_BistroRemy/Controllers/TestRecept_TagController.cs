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
    public class TestRecept_TagController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllReceptTag()
        {
            var ctx = new TestReceptContext();
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(0));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(1));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(2));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(3));

            var controller = new Recept_TagController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ReceptTagModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameReceptTag()
        {
            var ctx = new TestReceptContext();
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(0));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(1));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(2));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(3));

            var controller = new Recept_TagController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<ReceptTagModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameReceptTag()
        {
            var ctx = new TestReceptContext();
            var controller = new Recept_TagController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            ctx.Receptek.Add(dc.ReceptDemos(0));
            ctx.Tagek.Add(dc.TagDemos(1));
            var postResponse=await controller.Post(new ReceptTagPostModel
            {
                R_id=1,
                TagNev="Demo1"
            }).ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(postResponse.IsSuccessStatusCode);

            //var response = controller.Get();
            //var contentResult = response as OkNegotiatedContentResult<List<ReceptTagModel>>;

            //Assert.IsNotNull(contentResult);
            //Assert.AreEqual("Demo1", contentResult.Content[contentResult.Content.Count - 1].TagNev);

        }

        [TestMethod]
        public async Task Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();
            var recept=ctx.Receptek.Add(dc.ReceptDemos(1));
            var ujtag=ctx.Tagek.Add(dc.TagDemos(0));
            var tag=ctx.Tagek.Add(dc.TagDemos(1));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(0));
            var demo=ctx.Recept_Tagek.Add(dc.Recept_TagDemos(1));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(2));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(3));

            demo.Tagek = tag;
            demo.Recept = recept;
            ujtag.Nev = "Demo12";

            var controller = new Recept_TagController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };

            var putResponse= await controller.Put(demo.Recept.Rid, new ReceptTagPutModel
            {
                TagNev = demo.Tagek.Nev,
                Uj_TagNev = ujtag.Nev
            }).ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(putResponse.IsSuccessStatusCode);

        }


        [TestMethod]
        public void Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            ctx.Receptek.Add(dc.ReceptDemos(1));
            ctx.Tagek.Add(dc.TagDemos(0));
            ctx.Tagek.Add(dc.TagDemos(1));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(0));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(1));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(2));
            ctx.Recept_Tagek.Add(dc.Recept_TagDemos(3));
            var controller = new Recept_TagController(ctx);


            controller.Delete(2,2);
            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<ReceptTagModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Content.Count());

        }

    }
}
