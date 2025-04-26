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
    public class IzlesPostmodel
    {
        public string TagNev { get; set; }
    }
    public class IzlesController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public IzlesController() { }
        public IzlesController(IReceptContext context)
        {
            ctx = context;
        }

        // GET api/<controller>
        public IHttpActionResult Get()
        {
            var res = ctx.Izlesek.ToList();
            if (res != null) return Ok(res);
            else return Content(HttpStatusCode.NoContent, "");
        }

        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
        {
            var res = ctx.Izlesek
                .Where(x => x.F_id == id)
                .ToList();
            if (res != null) return Ok(res);
            else return NotFound();
        }

        // POST api/<controller>
        public IHttpActionResult Post(int F_id, [FromBody] IzlesPostmodel value)
        {
            var tag = ctx.Tagek
                .Where(x => x.Nev == value.TagNev)
                .Select(x => x.Tid)
                .FirstOrDefault();

            try
            {
                if (tag.ToString() != "")
                {
                    ctx.Izlesek.Add(new Izles
                    {
                        T_id = tag,
                        F_id = F_id
                    });

                    ctx.SaveChanges();
                    return Ok();
                }
                else return BadRequest();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] string value)
        {
            return Content(HttpStatusCode.NotImplemented, "");
        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int T_id, int F_id)
        {
            if(T_id.ToString()!=null && F_id.ToString() != null)
            {
                var res = ctx.Izlesek
                    .Where(x => x.T_id == T_id && x.F_id == F_id)
                    .FirstOrDefault();

                ctx.Izlesek.Remove(res);
                ctx.SaveChanges();

                return Ok();
            }
            return NotFound();
        }
    }
}