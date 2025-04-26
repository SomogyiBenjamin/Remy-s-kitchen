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
    public class ReceptHozzavaloPutModel
    {
        public double Mennyiseg { get; set; }
        public string MertekegysegNev { get; set; }
    }
    public class ReceptHozzavaloPostModel
    {
        public double Mennyiseg { get; set; }
        public string MertekegysegNeve { get; set; }
        public string HozzavaloNev { get; set; }
        public int R_id { get; set; }
    }

    public class ReceptHozzavaloModel
    {
        public int R_id { get; set; }
        public int H_id { get; set; }
        public double Mennyiseg { get; set; }
        public string Mertekegyseg { get; set; }
        public string ReceptNev { get; set; }
        public string KategoriaNev { get; set; }
        public string FelhasznaloNev { get; set; }
        public string HozzavaloNev { get; set; }
    }

    public class Recept_HozzavaloController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public Recept_HozzavaloController() { }
        public Recept_HozzavaloController(IReceptContext context)
        {
            ctx = context;
        }


        // GET api/<controller>
        public IHttpActionResult Get()
        {
            
                var result = ctx.Recept_Hozzavalok
                    .Include(x => x.Recept)
                    .Include(x => x.Recept.Kategoria)
                    .Include(x => x.Recept.Felhasznalo)
                    .Include(x => x.Hozzavalo)
                    .Include(x=>x.Mertekegyseg)
                    .Select(rh => new ReceptHozzavaloModel
                    {
                        R_id = rh.R_id,
                        H_id = rh.H_id,
                        Mennyiseg = rh.Mennyiseg,
                        Mertekegyseg = rh.Mertekegyseg.MertekegysegNev,
                        ReceptNev = rh.Recept.Nev,
                        KategoriaNev = rh.Recept.Kategoria.Nev,
                        FelhasznaloNev = rh.Recept.Felhasznalo.Fnev,
                        HozzavaloNev = rh.Hozzavalo.Nev
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
            

                

                var result = ctx.Recept_Hozzavalok
                    .Include(x => x.Recept)
                    .Include(x => x.Recept.Kategoria)
                    .Include(x => x.Recept.Felhasznalo)
                    .Include(x => x.Hozzavalo)
                    .Include(x => x.Mertekegyseg)
                    .Select(rh => new ReceptHozzavaloModel
                    {
                        R_id = rh.R_id,
                        H_id = rh.H_id,
                        Mennyiseg = rh.Mennyiseg,
                        Mertekegyseg = rh.Mertekegyseg.MertekegysegNev,
                        ReceptNev = rh.Recept.Nev,
                        KategoriaNev = rh.Recept.Kategoria.Nev,
                        FelhasznaloNev = rh.Recept.Felhasznalo.Fnev,
                        HozzavaloNev = rh.Hozzavalo.Nev
                    })
                    .Where(x=>x.R_id==id)
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

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] ReceptHozzavaloPostModel value)
        {
            try
            {
                var hid = ctx.Hozzavalok
                    .Where(x => x.Nev == value.HozzavaloNev)
                    .Select(x => x.Hid)
                    .FirstOrDefault();

                var mertekegyseg = ctx.Mertekegysegek
                    .Where(x => x.MertekegysegNev == value.MertekegysegNeve)
                    .Select(x => x.Mid)
                    .FirstOrDefault();

                ctx.Recept_Hozzavalok.Add(
                    new Recept_Hozzavalo
                    {
                        Mennyiseg = value.Mennyiseg,
                        M_id = mertekegyseg,
                        R_id = value.R_id,
                        H_id = hid

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
        public IHttpActionResult Put(int Rid,string HozzavaloNev, [FromBody] ReceptHozzavaloPutModel value)
        {
            
                var rh = ctx.Recept_Hozzavalok
                    .Include(x => x.Hozzavalo)
                    .Where(x => x.R_id == Rid && x.Hozzavalo.Nev == HozzavaloNev)
                    .FirstOrDefault();

                var mid = ctx.Mertekegysegek
                .Where(x => x.MertekegysegNev == value.MertekegysegNev)
                .Select(x=>x.Mid)
                .FirstOrDefault();

                if (rh != null)
                {
                    rh.M_id = mid;
                    rh.Mennyiseg = value.Mennyiseg;
                    ctx.SaveChanges();
                    return Content(HttpStatusCode.OK, "");
                }
                else
                {
                    return Content(HttpStatusCode.NotFound, "");
                }

        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int Rid, string HozzavaloNev)
        {

            
                var hozzavalo = ctx.Hozzavalok
                    .Where(x => x.Nev == HozzavaloNev)
                    .Select(x => x.Hid)
                    .FirstOrDefault();


                var del = ctx.Recept_Hozzavalok
                    .Where(x => x.R_id == Rid && x.H_id == hozzavalo)
                    .FirstOrDefault();
                if (del != null)
                {
                    ctx.Recept_Hozzavalok.Remove(del);
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