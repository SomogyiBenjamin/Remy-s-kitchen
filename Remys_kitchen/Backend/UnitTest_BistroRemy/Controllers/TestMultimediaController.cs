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
    public class TestMultimediaController
    {
        DemosClass dc = new DemosClass();
        [TestMethod]
        public async Task Get_ShouldReturnAllMultimedia()
        {
            var ctx = new TestReceptContext();
            ctx.Multimediak.Add(dc.MultimediaDemos(0));
            ctx.Multimediak.Add(dc.MultimediaDemos(1));
            ctx.Multimediak.Add(dc.MultimediaDemos(2));
            ctx.Multimediak.Add(dc.MultimediaDemos(3));

            var controller = new MultimediaController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<MultimediaModel> contentResult));
            //var contentResult = response as OkNegotiatedContentResult<List<Kategoria>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameMultimedia()
        {
            var ctx = new TestReceptContext();
            ctx.Multimediak.Add(dc.MultimediaDemos(0));
            ctx.Multimediak.Add(dc.MultimediaDemos(1));
            ctx.Multimediak.Add(dc.MultimediaDemos(2));

            var controller = new MultimediaController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<MultimediaModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public async Task Post_ShouldReturnSameMultimedia()
        {
            var ctx = new TestReceptContext();
            ctx.Receptek.Add(dc.ReceptDemos(0));
            var controller = new MultimediaController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var postResponse= await controller.Post(new MultimediaPostModel
            {
                URL="DemoUrl",
                R_id=1,
            }).ExecuteAsync(CancellationToken.None);

            Assert.IsTrue(postResponse.IsSuccessStatusCode);


            //var response = await controller.Get();
            //var contentResult = response as OkNegotiatedContentResult<List<MultimediaModel>>;

            //Assert.IsNotNull(contentResult);
            //Assert.AreEqual("DemoUrl", contentResult.Content[contentResult.Content.Count - 1].URL);

        }

        [TestMethod]
        public void Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new MultimediaController(ctx);
            ctx.Multimediak.Add(dc.MultimediaDemos(0));
            ctx.Multimediak.Add(dc.MultimediaDemos(1));
            ctx.Multimediak.Add(dc.MultimediaDemos(2));
            ctx.Multimediak.Add(dc.MultimediaDemos(3));

            controller.Delete(2);
            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<MultimediaModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Content.Count());

        }

    }
}
