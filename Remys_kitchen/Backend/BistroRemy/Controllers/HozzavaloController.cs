using BistroRemy.Models;
using BistroRemy.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;

namespace BistroRemy.Controllers
{
    public class HozzavaloPostModel
    {
        public string Nev { get; set; }
    }

    public class HozzavaloModel
    {
        public int Hid { get; set; }
        public string Nev { get; set; }
        public IEnumerable<string> ReceptNevek { get; set; }
    }



    public class HozzavaloController : ApiController
    {

        private IReceptContext ctx = new ReceptContext();
        public HozzavaloController() { }
        public HozzavaloController(IReceptContext context)
        {
            ctx = context;
        }

        // GET api/<controller>
        public IHttpActionResult Get()
        {

            var hozzavalok = ctx.Hozzavalok
               .Include(x=>x.ReceptHozzavalok)
               .Select(x => new HozzavaloModel
               {
                   Hid = x.Hid,
                   Nev = x.Nev,
                   ReceptNevek = x.ReceptHozzavalok.Select(rh => rh.Recept.Nev).ToList()
               })
               .ToList();


            if (hozzavalok.Count != 0)
            {
                return Ok(hozzavalok);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, "");
            }

        }


        //public IHttpActionResult Get()
        //{
        //    var hozzavalok = ctx.Hozzavalok
        //        .Select(x => new HozzavaloModel
        //        {
        //            Hid = x.Hid,
        //            Nev = x.Nev,
        //            ReceptNevek = x.ReceptHozzavalok != null
        //                ? x.ReceptHozzavalok.Select(rh => rh.Recept.Nev).ToList()
        //                : new List<string>() //Itt van változtatás
        //        })
        //        .ToList();

        //    if (hozzavalok.Count != 0)
        //    {
        //        return Ok(hozzavalok);
        //    }
        //    else
        //    {
        //        return NotFound();
        //    }
        //}

        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
        {

            var hozzavalok = ctx.Hozzavalok
                    .Select(x => new HozzavaloModel
                    {
                        Hid = x.Hid,
                        Nev = x.Nev,
                        ReceptNevek = x.ReceptHozzavalok.Select(rh => rh.Recept.Nev).ToList()
                    })
                    .Where(x => x.Hid == id)
                    .ToList();

            if (hozzavalok.Count != 0)
            {
                return Ok(hozzavalok);
            }
            else
            {
                return NotFound();
            }

            
        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] HozzavaloPostModel value)
        {
            try
            {
                var res = ctx.Hozzavalok
                    .Where(x => x.Nev == value.Nev)
                    .FirstOrDefault();


                if (res == null)
                {
                    ctx.Hozzavalok.Add(new Hozzavalo
                    {
                        Nev = value.Nev,
                    });

                    ctx.SaveChanges();
                    return Ok();
                }
                return Content(HttpStatusCode.Conflict, "A hozzávaló már létezik.");

            }
            catch (Exception)
            {

                return InternalServerError();
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
          
            var hozzavalok = ctx.Hozzavalok
                    .Where(x => x.Hid == id)
                    .FirstOrDefault();
            var hozzavaloMertekegyseg = ctx.Mertekegyseg_Hozzavalok
                .Where(x => x.H_id == id)
                .ToList();
            var hozzavaloErzekenyseg = ctx.Hozzavalo_Erzekenysegek
                .Where(x => x.H_id == id)
                .ToList();
            var receptHozzavalo = ctx.Recept_Hozzavalok
                .Where(x => x.H_id == id)
                .ToList();


            if (hozzavalok != null)
            {
                

                if (hozzavaloMertekegyseg != null)
                {
                    foreach (var item in hozzavaloMertekegyseg)
                    {
                        ctx.Mertekegyseg_Hozzavalok.Remove(item);
                    }
                }
                if (hozzavaloErzekenyseg != null)
                {
                    foreach (var item in hozzavaloErzekenyseg)
                    {
                        ctx.Hozzavalo_Erzekenysegek.Remove(item);
                    }
                }
                if (receptHozzavalo != null)
                {
                    foreach (var item in receptHozzavalo)
                    {
                        ctx.Recept_Hozzavalok.Remove(item);
                    }
                }
                ctx.Hozzavalok.Remove(hozzavalok);
                ctx.SaveChanges();
                return Ok();
            }
            else
            {
                return NotFound();
            }
              

        }
    }
}