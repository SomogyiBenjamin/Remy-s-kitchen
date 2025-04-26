using BistroRemy.Database;
using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BistroRemy.Controllers
{

    public class MertekegysegModel
    {
        public int Mid { get; set; }
        public string MertekegysegNev { get; set; }
    }

    public class MertekegysegPostModel
    {
        public string MertekegysegNev { get; set; }
    }


    public class MertekegysegController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public MertekegysegController() { }
        public MertekegysegController(IReceptContext context)
        {
            ctx = context;
        }


        // GET api/<controller>
        public IHttpActionResult Get()
        {
            
                var mert= ctx.Mertekegysegek
                    .Select(x=>new MertekegysegModel 
                    { 
                        Mid=x.Mid,
                        MertekegysegNev=x.MertekegysegNev
                    }).ToList();
            if (mert.Count != 0)
            {
                return Ok(mert);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, "");
            }
            
        }

        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
        {
            
                var mert= (ctx.Mertekegysegek
                    .Select(x => new MertekegysegModel
                    {
                        Mid = x.Mid,
                        MertekegysegNev = x.MertekegysegNev
                    })
                    .Where(x => x.Mid == id)
                    .ToList()
                    );

            if (mert.Count != 0)
            {
                return Ok(mert);
            }
            else
            {
                return NotFound();
            }

        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] MertekegysegPostModel value)
        {

            try
            {
                var mertk = ctx.Mertekegysegek
                    .Where(x => x.MertekegysegNev == value.MertekegysegNev)
                    .FirstOrDefault();

                if (mertk == null)
                {
                    ctx.Mertekegysegek.Add(new Mertekegyseg
                    {
                        MertekegysegNev = value.MertekegysegNev
                    });

                    ctx.SaveChanges();
                    return Ok();
                }
                else return NotFound();
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }

                
            

        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] MertekegysegPostModel value)
        {
            try
            {
                var mertk = ctx.Mertekegysegek
                    .Where(x => x.Mid == id)
                    .FirstOrDefault();

                if (mertk != null)
                {
                    mertk.MertekegysegNev = value.MertekegysegNev;

                    ctx.SaveChanges();
                    return Content(HttpStatusCode.OK, "");
                }
                else
                {
                    return Content(HttpStatusCode.NotFound, "");
                }
            }
            catch (Exception)
            {

                return Content(HttpStatusCode.InternalServerError, "");
            }

            

        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {

            
                var mertk = ctx.Mertekegysegek
                    .Where(x => x.Mid == id)
                    .FirstOrDefault();

                if (mertk != null)
                {
                    ctx.Mertekegysegek.Remove(mertk);
                    ctx.SaveChanges();
                return Content(HttpStatusCode.OK, "");
                }
                else
                {
                    return Content(HttpStatusCode.NotFound, "");
                }
            



        }
    }
}