using BistroRemy.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace UnitTest_BistroRemy
{
    [TestClass]
    public class TestErtekelesekController
    {
        DemosClass dc = new DemosClass();


        [TestMethod]
        public void Get_ShouldReturnAllErtekeles()
        {

            var ctx = new TestReceptContext();

            ctx.Ertekelesek.Add(dc.ErtekelesDemos(0));
        
            var controller = new ErtekelesController(ctx);

            var result = controller.Get().Headers.ToList();
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());

        }

        [TestMethod]
        public void Get_ShouldReturnSameErtekeles()
        {
            var ctx = new TestReceptContext();
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(0));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(1));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(2));

            var controller = new ErtekelesController(ctx);
            var response = controller.Get(2); // HTTP Response Message
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode); // Ellenőrizzük a státuszt

            // Extract the content from the response
            var result = response.Content.ReadAsAsync<List<ErtekelesModel>>().Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result[2].ReceptId);
        }


        [TestMethod]
        public void Post_ShouldReturnSameErtekeles()
        {
            var ctx = new TestReceptContext();
            var controller = new ErtekelesController(ctx);

            ctx.Ertekelesek.Add(dc.ErtekelesDemos(0));

            controller.Post(new ErtekelesPostModel
            {
                Csillag=2,
                ReceptId=1,
                FelhasznaloId=1,
                
            });

            var response = controller.Get(); // HTTP Response Message
            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode); // Ellenőrizzük a státuszt

            // Extract the content from the response
            var result = response.Content.ReadAsAsync<List<ErtekelesModel>>().Result;

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result[0].Csillag);
        }

        [TestMethod]
        public void Put_SuccessfullUpdate()
        {
            var ctx = new TestReceptContext();

            ctx.Ertekelesek.Add(dc.ErtekelesDemos(0));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(1));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(2));

            var controller = new ErtekelesController(ctx);

            controller.Put(1, new ErtekelesPostModel
            {
                Csillag = 5,
                ReceptId = 2,
                FelhasznaloId = 2
            });

            var response = controller.Get(1); // HTTP Response Message
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode); // Ellenőrizzük a státuszt

            // Extract the content from the response
            var result = response.Content.ReadAsAsync<List<ErtekelesModel>>().Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(5, result[1].Csillag);

        }


        [TestMethod]
        public void Delete_SuccessfullDelete()
        {
            var ctx = new TestReceptContext();

            ctx.Ertekelesek.Add(dc.ErtekelesDemos(0));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(1));
            ctx.Ertekelesek.Add(dc.ErtekelesDemos(2));

            var controller = new ErtekelesController(ctx);

            controller.Delete(2);

            var response = controller.Get(1); // HTTP Response Message
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode); // Ellenőrizzük a státuszt

            // Extract the content from the response
            var result = response.Content.ReadAsAsync<List<ErtekelesModel>>().Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
        }


    }
}
