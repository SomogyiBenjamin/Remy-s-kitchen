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

    public class Mertekegyseg_HozzavaloModel
    {
        public int H_id { get; set; }
        public string MertekegysegNev { get; set; }
        public string HozzavaloNev { get; set; }
    }

    public class MertekegysegHozzavaloPostModel
    {
        public string HozzavaloNev { get; set; }
        public string MertekegysegNev { get; set; }
    }
    public class Mertekegyseg_HozzavaloController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public Mertekegyseg_HozzavaloController() { }
        public Mertekegyseg_HozzavaloController(IReceptContext context)
        {
            ctx = context;
        }




        // GET api/<controller>
        public IHttpActionResult Get()
        {

           var mh= ctx.Mertekegyseg_Hozzavalok
                .Include(x => x.Hozzavalo)
                .Include(x => x.Mertekegyseg)
                .Select(x => new Mertekegyseg_HozzavaloModel
                {
                    H_id=x.Hozzavalo.Hid,
                    MertekegysegNev = x.Mertekegyseg.MertekegysegNev,
                    HozzavaloNev = x.Hozzavalo.Nev
                }
                )
                .ToList();

            if (mh.Count != 0)
            {
                return Ok(mh);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, mh);
            }
            
        }

        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
        {
            
                var mh= ctx.Mertekegyseg_Hozzavalok
                    .Include(x => x.Hozzavalo)
                    .Include(x => x.Mertekegyseg)
                    .Select(x => new Mertekegyseg_HozzavaloModel
                    {
                        H_id = x.Hozzavalo.Hid,
                        MertekegysegNev = x.Mertekegyseg.MertekegysegNev,
                        HozzavaloNev = x.Hozzavalo.Nev
                    }
                )
                    .Where(x=>x.H_id==id)
                    .ToList();

            if (mh.Count != 0)
            {
                return Ok(mh);
            }
            else
            {
                return NotFound();
            }
        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] MertekegysegHozzavaloPostModel value)
        {

            try
            {
                var hozz = ctx.Hozzavalok
                .Where(x => x.Nev == value.HozzavaloNev)
                .Select(x => x.Hid)
                .FirstOrDefault();


                if (hozz == 0)
                {
                    ctx.Hozzavalok.Add(new Hozzavalo
                    {
                        Nev = value.HozzavaloNev
                    });
                    ctx.SaveChanges();
                }


                hozz = ctx.Hozzavalok
                 .Where(x => x.Nev == value.HozzavaloNev)
                 .Select(x => x.Hid)
                 .FirstOrDefault();

                //Ha hozzávalót kell feltölteni mértékegységgel vedd vissza a commentet!

                string[] cycle = value.MertekegysegNev.Split(','); //Hány ciklust kell futni [Mennyi mértékegységet adtunk meg]
                for (int i = 0; i < cycle.Length; i++)
                {
                    var name = cycle[i];
                    var mid = ctx.Mertekegysegek
                    .Where(x => x.MertekegysegNev == name)
                    .Select(x => x.Mid)
                    .FirstOrDefault();

                    ctx.Mertekegyseg_Hozzavalok.Add(new Mertekegyseg_Hozzavalo
                    {
                        M_id = mid,
                        H_id = hozz

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
            return Content(HttpStatusCode.NotImplemented, "");
        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int Hid, int Mid)
        {
           
                 var res=ctx.Mertekegyseg_Hozzavalok
                    .Include(x => x.Hozzavalo)
                    .Include(x => x.Mertekegyseg)
                    .Where(x => x.H_id == Hid && x.M_id==Mid)
                    .FirstOrDefault();
            if (res != null)
            {
                ctx.Mertekegyseg_Hozzavalok.Remove(res);
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