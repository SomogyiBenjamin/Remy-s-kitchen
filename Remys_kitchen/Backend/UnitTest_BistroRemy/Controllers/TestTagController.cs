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
    public class TestTagController
    {
        DemosClass dc = new DemosClass();
        [TestMethod]
        public async Task Get_ShouldReturnAllTag()
        {
            var ctx = new TestReceptContext();
            ctx.Tagek.Add(dc.TagDemos(0));
            ctx.Tagek.Add(dc.TagDemos(1));
            ctx.Tagek.Add(dc.TagDemos(2));
            ctx.Tagek.Add(dc.TagDemos(3));

            var controller = new TagController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Tagek> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }
        [TestMethod]
        public async Task Get_ShouldReturnSameTag()
        {
            var ctx = new TestReceptContext();
            ctx.Tagek.Add(dc.TagDemos(0));
            ctx.Tagek.Add(dc.TagDemos(1));
            ctx.Tagek.Add(dc.TagDemos(2));

            var controller = new TagController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Tagek> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public void Post_ShouldReturnSameTag()
        {
            var ctx = new TestReceptContext();
            var controller = new TagController(ctx);
            controller.Post(new TagPostModel
            {
                Nev = "DemoTag"
            });

            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<Tagek>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("DemoTag", contentResult.Content[contentResult.Content.Count - 1].Nev);

        }

        [TestMethod]
        public void Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();
            var controller = new TagController(ctx);
            ctx.Tagek.Add(dc.TagDemos(0));
            ctx.Tagek.Add(dc.TagDemos(1));
            ctx.Tagek.Add(dc.TagDemos(2));
            ctx.Tagek.Add(dc.TagDemos(3));

            controller.Put(2, new TagPostModel
            {
                Nev = "Updated"
            });
            var response = controller.Get(2);
            var contentResult = response as OkNegotiatedContentResult<List<Tagek>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("Updated", contentResult.Content[0].Nev);

        }
    }
}
