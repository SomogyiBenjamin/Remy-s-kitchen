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
    public class ErzekenysegPostModel
    {
        public int Eid { get; set; }
        public string Nev { get; set; }
        

    }


    public class ErzekenysegController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public ErzekenysegController() { }
        public ErzekenysegController(IReceptContext context)
        {
            ctx = context;
        }


        // GET api/<controller>
        public IHttpActionResult Get()
        {

           
                var result = ctx.Erzekenysegek
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
       
            
                var result = ctx.Erzekenysegek
                    .Where(x => x.Eid == id)
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
        public IHttpActionResult Post([FromBody] ErzekenysegPostModel erzekenyseg)
        {

            try
            {
                ctx.Erzekenysegek.Add(new Erzekenyseg
                {
                    Eid=erzekenyseg.Eid,
                    Nev=erzekenyseg.Nev
                    
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
        public IHttpActionResult Put(int id, [FromBody] ErzekenysegPostModel value)
        {

            //using (var ctx=new ReceptContext())
            //{
            //    var res = ctx.Erzekenysegek
            //        .Where(x => x.Eid == id)
            //        .FirstOrDefault();

            //    if (res != null)
            //    {
            //        res.Nev = value.Nev;
            //        res.Kivaltja = value.Kivaltja;

            //    }
            //    ctx.SaveChanges();




            //}
            return Content(HttpStatusCode.NotImplemented,"");


        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {

        
                Erzekenyseg result = null;

                result = ctx.Erzekenysegek
                    .Where(x => x.Eid == id)
                    .FirstOrDefault();
            var fres = ctx.Felhasznalo_Erzekenysegek
            .Where(x => x.E_id == id)
            .ToList();

            var hres = ctx.Hozzavalo_Erzekenysegek
                .Where(x => x.E_id == id)
                .ToList();
                if (result != null)
                {
                foreach (var item in fres)
                {
                    ctx.Felhasznalo_Erzekenysegek.Remove(item);
                    
                }
                foreach (var item in hres)
                {
                    ctx.Hozzavalo_Erzekenysegek.Remove(item);

                }
                ctx.SaveChanges();

                    ctx.Erzekenysegek.Remove(result);
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