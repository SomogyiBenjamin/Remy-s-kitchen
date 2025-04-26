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
    public class LepesPutModel
    {
        public int Sorszam { get; set; }
        public string Leiras { get; set; }
    }
    public class LepesPostModel
    {
        public int Sorszam { get; set; }
        public string Leiras { get; set; }
        public int R_id{ get; set; }

    }
    public class LepesModel
    {
        public int Lid { get; set; }
        public int Sorszam { get; set; }
        public string Leiras { get; set; }
        public int ReceptId { get; set; }
        public string ReceptNev { get; set; }
    }

    public class LepesController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public LepesController() { }
        public LepesController(IReceptContext context)
        {
            ctx = context;
        }


        //GET api/<controller>
        //public IHttpActionResult Get()
        //{

        //    var result = ctx.Lepesek
        //        .Include(x => x.Recept)
        //        .Include(x => x.Recept.Kategoria)
        //        .Include(x => x.Recept.Felhasznalo)
        //        .Include(x => x.Recept.ReceptHozzavalok)
        //        .Select(x => new LepesModel
        //        {
        //            Lid = x.Lid,
        //            Sorszam = x.Sorszam,
        //            Leiras = x.Leiras,
        //            ReceptId = x.R_id,
        //            ReceptNev = x.Recept.Nev
        //        })
        //        .ToList();

        //    if (result.Count != 0)
        //    {
        //        return Ok(result);
        //    }
        //    else
        //    {
        //        return Content(HttpStatusCode.NoContent, "");
        //    }

        //}


        public IHttpActionResult Get()
        {
            var result = ctx.Lepesek
                .Include(x => x.Recept)
                .Include(x => x.Recept.Kategoria)
                .Include(x => x.Recept.Felhasznalo)
                .Include(x => x.Recept.ReceptHozzavalok)
                .Select(x => new LepesModel
                {
                    Lid = x.Lid,
                    Sorszam = x.Sorszam,
                    Leiras = x.Leiras,
                    ReceptId = x.R_id,
                    ReceptNev = x.Recept != null ? x.Recept.Nev : "Nincs recept"
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
            
                var result = ctx.Lepesek
                    .Include(x => x.Recept)
                    .Include(x => x.Recept.Kategoria)
                    .Include(x => x.Recept.Felhasznalo)
                    .Include(x => x.Recept.ReceptHozzavalok)
                    .Select(x => new LepesModel
                    {
                        Lid = x.Lid,
                        Sorszam = x.Sorszam,
                        Leiras = x.Leiras,
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

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] LepesPostModel value)
        {
            try
            {
                ctx.Lepesek.Add(new Lepes
                {
                    Sorszam = value.Sorszam,
                    Leiras = value.Leiras,
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
        public IHttpActionResult Put(int id, [FromBody] LepesPutModel value)
        {
            try
            {
                
                var sorszam = value.Sorszam;
                var lep = ctx.Lepesek
                    .Where(x => x.R_id == id && x.Sorszam==sorszam)
                    .FirstOrDefault();

                if (lep != null)
                {
                    
                    lep.Leiras = value.Leiras;
                    lep.Sorszam = value.Sorszam;

                    ctx.SaveChanges();
                    return Content(HttpStatusCode.OK, "");
                }

                return NotFound();

                
            }
            catch (Exception ex)
            {

                return Content(HttpStatusCode.InternalServerError, ex);
            }



            


        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {
      
                var result = ctx.Lepesek
                    .Include(x => x.Recept)
                    .Include(x => x.Recept.Kategoria)
                    .Include(x => x.Recept.Felhasznalo)
                    .Include(x => x.Recept.ReceptHozzavalok)
                    .Where(x => x.Lid == id)
                    .FirstOrDefault();

                if (result != null)
                {
                    ctx.Lepesek.Remove(result);
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