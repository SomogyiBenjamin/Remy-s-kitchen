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
    public class Hozzavalo_ErzekenysegController : ApiController
    {
        // GET api/<controller>

        private IReceptContext ctx = new ReceptContext();
        public Hozzavalo_ErzekenysegController() { }
        public Hozzavalo_ErzekenysegController(IReceptContext context)
        {
            ctx = context;
        }

        public class HozzavaloErzekenysegModel
        {
            public int Eid { get; set; }
            public int Hid { get; set; }
            public string HozzavaloNev { get; set; }
            public string ErzekenysegNev { get; set; }
        }

        public class HozzavaloErzekenysegPostModel
        {
            public string HozzavaloNev { get; set; }
            public string ErzekenysegNev { get; set; }
        }


        public IHttpActionResult Get()
        {
            var he= ctx.Hozzavalo_Erzekenysegek
                .Include(x=>x.Erzekenyseg)
                .Include(x=>x.Hozzavalo)
                .Select(x=> new HozzavaloErzekenysegModel 
                { 
                    HozzavaloNev=x.Hozzavalo.Nev,
                    ErzekenysegNev=x.Erzekenyseg.Nev
                })
                .ToList();

            if (he.Count != 0)
            {
                return Ok(he);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, "");
            }
        }

        // GET api/<controller>/5
        public IHttpActionResult Get(int id) //Érzékenység alapján való lekérés
        {
            var he= ctx.Hozzavalo_Erzekenysegek
                .Include(x => x.Erzekenyseg)
                .Include(x => x.Hozzavalo)
                .Select(x => new HozzavaloErzekenysegModel
                {
                    HozzavaloNev = x.Hozzavalo.Nev,
                    ErzekenysegNev = x.Erzekenyseg.Nev,
                    Eid=x.E_id,
                    Hid=x.H_id
                })
                .Where(x=>x.Eid==id)
                .ToList();

            if (he.Count != 0)
            {
                return Ok(he);
            }
            else
            {
                return NotFound();
            }
        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] HozzavaloErzekenysegPostModel value)
        {
            try
            {
                int HozzId = ctx.Hozzavalok
                    .Where(x => x.Nev == value.HozzavaloNev)
                    .Select(x => x.Hid)
                    .FirstOrDefault();

                int ErzId = ctx.Erzekenysegek
                    .Where(x => x.Nev == value.ErzekenysegNev)
                    .Select(x => x.Eid)
                    .FirstOrDefault();

                ctx.Hozzavalo_Erzekenysegek.Add(new Hozzavalo_Erzekenyseg
                {
                    E_id = ErzId,
                    H_id = HozzId
                });

                ctx.SaveChanges();

                return Ok();
            }
            catch (Exception)
            {

                return InternalServerError();
            }

                


        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] string value)
        {
            return Content(HttpStatusCode.NotImplemented,"");
        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {
            return Content(HttpStatusCode.NotImplemented, "");
        }
    }
}