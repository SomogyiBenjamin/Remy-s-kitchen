using BistroRemy.Models;
using BistroRemy.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BistroRemy.Controllers
{
    public class TagPostModel
    {
        public string Nev { get; set; }

    }
    public class TagController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public TagController() { }
        public TagController(IReceptContext context)
        {
            ctx = context;
        }


        // GET api/<controller>
        public IHttpActionResult Get()
        {
            
            
                var result = ctx.Tagek
                    .ToList();

            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, "");
            }


        }

        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
        {
            
                var result = ctx.Tagek
                    .Where(x => x.Tid == id)
                    .ToList();

            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, "");
            }


        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] TagPostModel value)
        {
            try
            {
                ctx.Tagek.Add(new Tagek
                {
                    Nev = value.Nev

                });
                ctx.SaveChanges();
                return Content(HttpStatusCode.OK, "");
            }
            catch (Exception)
            {

                return Content(HttpStatusCode.InternalServerError, "");
            }
              

            
        }
        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] TagPostModel value)
        {

            

                var tag = ctx.Tagek
                    .Where(x => x.Tid == id)
                    .FirstOrDefault();

                if (tag != null)
                {
                    tag.Nev = value.Nev;
                    ctx.SaveChanges();
                    return Content(HttpStatusCode.OK, "");
                }
                else
                {
                    return Content(HttpStatusCode.NotFound, "");
                }


            


        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {
            //using (var ctx=new ReceptContext())
            //{

            //    var del = ctx.Tagek
            //        .Where(x => x.Tid == id)
            //        .FirstOrDefault();
            //    if (del != null)
            //    {
            //        var rtd=ctx.Recept_Tagek
            //            .Where(x => x.T_id == id)
            //            .FirstOrDefault();

            //        ctx.Recept_Tagek.Remove(rtd);
            //        ctx.SaveChanges();


            //        ctx.Tagek.Remove(del);
            //        ctx.SaveChanges();
            //    }


            //}

            return Content(HttpStatusCode.NotImplemented, "");


        }
    }
}