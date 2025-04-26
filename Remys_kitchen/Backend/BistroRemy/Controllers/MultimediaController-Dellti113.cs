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
        public IEnumerable<MultimediaModel> Get()
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

                return result;
            
        }

        // GET api/<controller>/5
        public IEnumerable<MultimediaModel> Get(int id)
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

                return result;
            
        }

        // POST api/<controller>

        //public HttpResponseMessage Post(HttpPostedFileBase file, MultimediaPostModel value)
        //{

        //        using (var memoryStream = new System.IO.MemoryStream())
        //        {
        //            file.InputStream.CopyTo(memoryStream); // A kép tartalmának olvasása
        //            var newVideo = new Multimedia
        //            {
        //                URL = memoryStream.ToArray(), // A képtartalom átalakítása byte tömbbé
        //                R_id = value.R_id
        //            };
        //            ctx.Multimediak.Add(newVideo); // Új rekord hozzáadása a DbContext-hez
        //            ctx.SaveChanges(); // Mentés az adatbázisba

        //        return Request.CreateResponse(HttpStatusCode.Created, newVideo);
        //    }



        //}


        public void Post([FromBody] MultimediaPostModel value)
        {




            ctx.Multimediak.Add(new Multimedia
            {
                URL = value.URL,
                R_id = value.R_id

            });

            ctx.SaveChanges();



        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            
                var result = ctx.Multimediak
                    .Include(x => x.Recept)
                    .Where(x => x.Vid == id)
                    .FirstOrDefault();

                if (result != null)
                {
                    ctx.Multimediak.Remove(result);
                    ctx.SaveChanges();
                }

            

        }
    }
}