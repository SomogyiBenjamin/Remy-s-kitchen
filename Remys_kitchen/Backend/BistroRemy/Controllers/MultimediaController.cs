using BistroRemy.Models;
using BistroRemy.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Threading.Tasks;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;
using Microsoft.AspNetCore.Mvc;

namespace BistroRemy.Controllers
{
    public class MultimediaPostModel
    {
        public string URL { get; set; }
        public int R_id { get; set; }

    }
    public class MultimediaModel
    {
        public int Vid { get; set; }
        public string URL { get; set; }
        public int ReceptId { get; set; }
        public string ReceptNev { get; set; }
    }

    public class MultimediaController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public MultimediaController() { }
        public MultimediaController(IReceptContext context)
        {
            ctx = context;
        }


        // GET api/<controller>
        public IHttpActionResult Get()
        {
            
                var result = ctx.Multimediak
                    .Include(x => x.Recept)
                    .Select(x => new MultimediaModel
                    {
                        Vid = x.Vid,
                        URL = x.URL,
                        ReceptId = x.R_id,
                        ReceptNev = x.Recept.Nev
                    })
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
           
                var result = ctx.Multimediak
                    .Include(x => x.Recept)
                    .Select(x => new MultimediaModel
                    {
                        Vid = x.Vid,
                        URL = x.URL,
                        ReceptId = x.R_id,
                        ReceptNev = x.Recept.Nev
                    })
                    .Where(x => x.ReceptId == id)
                    .ToList();

            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                return Content(HttpStatusCode.NotFound, "");
            }
            
        }

     

        public IHttpActionResult Post([FromBody] MultimediaPostModel value)
        {
            try
            {
                ctx.Multimediak.Add(new Multimedia
                {
                    URL = value.URL,
                    R_id = value.R_id
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
        public IHttpActionResult Put(int id, [FromBody] string value)
        {

            return Content(HttpStatusCode.NotImplemented, "");

        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {
            
                var result = ctx.Multimediak
                    .Include(x => x.Recept)
                    .Where(x => x.Vid == id)
                    .FirstOrDefault();

                if (result != null)
                {
                    ctx.Multimediak.Remove(result);
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