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
    public class TestMertekegysegController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public async Task Get_ShouldReturnAllMertekegyseg()
        {
            var ctx = new TestReceptContext();
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(0));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(1));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(2));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(3));

            var controller = new MertekegysegController(ctx)
            {

                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()

            };
            var response = await controller.Get().ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<MertekegysegModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(4, contentResult.Count());

        }

        [TestMethod]
        public async Task Get_ShouldReturnSameMertekegyseg()
        {
            var ctx = new TestReceptContext();
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(0));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(1));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(2));

            var controller = new MertekegysegController(ctx)
            {
                Request = new HttpRequestMessage(),
                Configuration = new HttpConfiguration()
            };
            var response = await controller.Get(2).ExecuteAsync(new System.Threading.CancellationToken());
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<MertekegysegModel> contentResult));

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(1, contentResult.Count);
        }

        [TestMethod]
        public void Post_ShouldReturnSameMertekegyseg()
        {
            var ctx = new TestReceptContext();
            var controller = new MertekegysegController(ctx);
            controller.Post(new MertekegysegPostModel
            {
                MertekegysegNev = "DemoMertekegyseg"
            });

            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<MertekegysegModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("DemoMertekegyseg", contentResult.Content[contentResult.Content.Count - 1].MertekegysegNev);

        }

        [TestMethod]
        public void Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();
            var controller = new MertekegysegController(ctx);
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(0));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(1));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(2));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(3));

            controller.Put(2, new MertekegysegPostModel
            {
                MertekegysegNev = "Updated"
            });
            var response = controller.Get(2);
            var contentResult = response as OkNegotiatedContentResult<List<MertekegysegModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual("Updated", contentResult.Content[0].MertekegysegNev);

        }

        [TestMethod]
        public void Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();
            var controller = new MertekegysegController(ctx);
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(0));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(1));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(2));
            ctx.Mertekegysegek.Add(dc.MertekegysegDemos(3));

            controller.Delete(2);
            var response = controller.Get();
            var contentResult = response as OkNegotiatedContentResult<List<MertekegysegModel>>;

            Assert.IsNotNull(contentResult);
            Assert.AreEqual(3, contentResult.Content.Count());

        }
    }
}
