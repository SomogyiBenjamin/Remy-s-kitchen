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

    public class ErtekelesModel
    {
        public int Ertid { get; set; }
        public int Csillag { get; set; }
        public int ReceptId { get; set; }
        public string ReceptNev { get; set; }
        public int FelhasznaloId { get; set; }
        public string FelhasznaloNev { get; set; }
    }

    public class ErtekelesPostModel
    {
        public int Csillag { get; set; }
        public int ReceptId { get; set; }
        public int FelhasznaloId { get; set; }
    }

    public class ErtekelesController : ApiController
    {

        private IReceptContext ctx = new ReceptContext();
        public ErtekelesController() { }
        public ErtekelesController(IReceptContext context)
        {
            ctx = context;
        }


        //GET api/<controller>
        //public IHttpActionResult Get()
        //{
        //    var ertekelesek = ctx.Ertekelesek
        //          .Include(x => x.Recept)
        //          .Include(x => x.Felhasznalo)
        //          .Select(x => new ErtekelesModel
        //          {
        //              Ertid = x.Ertid,
        //              Csillag = x.Csillag,
        //              ReceptId = x.R_id,
        //              ReceptNev = x.Recept.Nev,
        //              FelhasznaloId = x.F_id,
        //              FelhasznaloNev = x.Felhasznalo.Fnev
        //          })
        //          .ToList();


        //    if (ertekelesek.Count != 0)
        //    {
        //        return Content(HttpStatusCode.OK, ertekelesek);
        //    }
        //    else
        //    {
        //        return NotFound();
        //    }

        //}


        public IHttpActionResult Get() //Változott
        {
            var ertekelesek = ctx.Ertekelesek
                .Select(x => new ErtekelesModel
                {
                    Ertid = x.Ertid,
                    Csillag = x.Csillag,
                    ReceptId = x.R_id,
                    ReceptNev = x.Recept != null ? x.Recept.Nev : "Nincs recept", // Null-ellenőrzés
                    FelhasznaloId = x.F_id,
                    FelhasznaloNev = x.Felhasznalo != null ? x.Felhasznalo.Fnev : "Nincs felhasználó" // Null-ellenőrzés
                })
                .ToList();

            if (ertekelesek.Count != 0)
            {
                return Content(HttpStatusCode.OK, ertekelesek);
            }
            else
            {
                return Content(HttpStatusCode.NoContent,"");
            }
        }

        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
        {

            var ertekelesek = ctx.Ertekelesek
                .Include(x => x.Recept)
                .Include(x => x.Felhasznalo)
                .Select(x => new ErtekelesModel
                {
                    Ertid = x.Ertid,
                    Csillag = x.Csillag,
                    ReceptId = x.R_id,
                    ReceptNev = x.Recept.Nev,
                    FelhasznaloId = x.F_id,
                    FelhasznaloNev = x.Felhasznalo.Fnev
                })
                .Where(x => x.ReceptId == id)
                .ToList();

            if (ertekelesek.Count != 0)
            {
                return Content(HttpStatusCode.OK, ertekelesek);
            }
            else
            {
                return NotFound();
            }


        }

        //POST api/<controller>
        public IHttpActionResult Post([FromBody] ErtekelesPostModel ertekeles)
        {

            try
            {
                ctx.Ertekelesek.Add(new Ertekeles
                {
                    Csillag = ertekeles.Csillag,
                    R_id = ertekeles.ReceptId,
                    F_id = ertekeles.FelhasznaloId
                });
                ctx.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }

        }


        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] ErtekelesPostModel ertekeles)
        {
            try
            {
                var result = ctx.Ertekelesek
                    .Where(x => x.Ertid == id)
                    .FirstOrDefault();

                if (result != null)
                {
                    result.Csillag = ertekeles.Csillag;
                    ctx.SaveChanges();
                    return Ok();
                }
                else return NotFound();

               
            }
            catch (Exception)
            {

                return InternalServerError();
            }
 



            



        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {


                var ertekelesek = ctx.Ertekelesek
                    .Include(x => x.Recept)
                    .Include(x => x.Felhasznalo)
                    .Where(x => x.Ertid == id)
                    .FirstOrDefault();

                if (ertekelesek != null)
                {
                    ctx.Ertekelesek.Remove(ertekelesek);
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