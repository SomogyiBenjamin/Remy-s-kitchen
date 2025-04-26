using BistroRemy.Database;
using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;

namespace BistroRemy.Controllers
{
    public class FelhasznaloErzekenysegPostModel
    {
        public int FelhasznaloId { get; set; }
        public string ErzekenysegNev { get; set; }
    }

    public class FelhasznaloErzekenysegModel
    {
        public int F_id { get; set; }
        public int E_id { get; set; }
        public string FelhasznaloNev { get; set; }
        public string ErzekenysegNev { get; set; }
    }


    public class Felhasznalo_ErzekenysegController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public Felhasznalo_ErzekenysegController() { }
        public Felhasznalo_ErzekenysegController(IReceptContext context)
        {
            ctx = context;
        }

        // GET api/<controller>
        public IHttpActionResult Get()
        {
            
                var result = ctx.Felhasznalo_Erzekenysegek
                    .Include(fe => fe.Felhasznalo)
                    .Include(fe => fe.Erzekenyseg)
                    .Select(fe => new FelhasznaloErzekenysegModel
                    {
                        F_id = fe.F_id,
                        E_id = fe.E_id,
                        FelhasznaloNev = fe.Felhasznalo.Fnev,
                        ErzekenysegNev = fe.Erzekenyseg.Nev
                    })
                    .ToList();


            if (result.Count != 0)
            {
                return Content(HttpStatusCode.OK, result);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, "");
            }

            
        }


        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
        {
            
                var result = ctx.Felhasznalo_Erzekenysegek
                    .Include(fe => fe.Felhasznalo)
                    .Include(fe => fe.Erzekenyseg)
                    .Select(fe => new FelhasznaloErzekenysegModel
                    {
                        F_id = fe.F_id,
                        E_id = fe.E_id,
                        FelhasznaloNev = fe.Felhasznalo.Fnev,
                        ErzekenysegNev = fe.Erzekenyseg.Nev
                    })
                    .Where(x=>x.F_id==id)
                    .ToList();


            if (result.Count != 0)
            {
                return Content(HttpStatusCode.OK, result);
            }
            else
            {
                return NotFound();
            }
            
        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] FelhasznaloErzekenysegPostModel value)
        {

            //var fid = ctx.Felhasznalok
            //     .Where(x => x.Id == value.FelhasznaloId)
            //     .Select(x => x.Id)
            //     .FirstOrDefault();

            try
            {
                var eid = ctx.Erzekenysegek
                    .Where(x => x.Nev == value.ErzekenysegNev)
                    .Select(x => x.Eid)
                    .FirstOrDefault();

                var notin = ctx.Felhasznalo_Erzekenysegek
                    .Where(x => x.E_id == eid && x.F_id == value.FelhasznaloId)
                    .FirstOrDefault();


                if (eid != 0 && notin == null)
                {
                    ctx.Felhasznalo_Erzekenysegek.Add(
                   new Felhasznalo_Erzekenyseg
                   {
                       F_id = value.FelhasznaloId,
                       E_id = eid
                   });
                    ctx.SaveChanges();
                }

                return Ok();

            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }

 

              
            

        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] string value)
        {
            //Szerintem ez nem kell
            return Content(HttpStatusCode.NotImplemented,"");
        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(string ErzNev, int fid)
        {


                var del = ctx.Felhasznalo_Erzekenysegek
                    .Include(x => x.Erzekenyseg)
                    .Where(x => x.Erzekenyseg.Nev == ErzNev && x.F_id == fid)
                    .FirstOrDefault();
                if (del != null)
                {
                    ctx.Felhasznalo_Erzekenysegek.Remove(del);
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