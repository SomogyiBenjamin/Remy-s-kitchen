using BistroRemy.Database;
using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BistroRemy.Controllers
{

    public class KategoriaPostModel
    {
        public string Nev { get; set; }

    }

    public class KategoriaController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public KategoriaController() { }
        public KategoriaController(IReceptContext context)
        {
            ctx = context;
        }

        // GET api/<controller>
        public IHttpActionResult Get()
        {
            
            
               var result = ctx.Kategoriak
                    .ToList();


            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                return Content(HttpStatusCode.NoContent,"");
            }
        }

        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
        {
           
            
               var result = ctx.Kategoriak
                    .Where(x => x.Kid == id)
                    .ToList();

            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                return NotFound();
            }

        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] KategoriaPostModel value)
        {
            try
            {

                var res = ctx.Kategoriak
                    .Where(x => x.Nev == value.Nev)
                    .FirstOrDefault();
                if (res == null)
                {
                    ctx.Kategoriak.Add(new Kategoria
                    {
                        Nev = value.Nev


                    });
                    ctx.SaveChanges();
                    return Ok();
                }
                return Conflict();
              
            }
            catch (Exception)
            {

                return Content(HttpStatusCode.InternalServerError, "");
            }




            


        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] KategoriaPostModel value)
        {
            try
            {
                var kat = ctx.Kategoriak
                    .Where(x => x.Kid == id)
                    .FirstOrDefault();
                if (kat != null)
                {
                    kat.Nev = value.Nev;
                    ctx.SaveChanges();
                    return Content(HttpStatusCode.OK, "");
                }

                else return NotFound();
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex);

            }




            



        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {

            Kategoria result = null;

                result = ctx.Kategoriak
                    .Where(x => x.Kid == id)
                    .FirstOrDefault();
                if (result != null)
                {
                    ctx.Kategoriak.Remove(result);
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