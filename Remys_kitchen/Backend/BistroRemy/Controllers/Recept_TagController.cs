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

    public class ReceptTagPostModel
    {
        public int R_id { get; set; }
        public string TagNev { get; set; }
    }

    public class ReceptTagModel
    {
        public int R_id { get; set; }
        public int T_id { get; set; }
        public string ReceptNev { get; set; }
        public string TagNev { get; set; }
    }

    public class ReceptTagPutModel
    {
        public string TagNev { get; set; }
        public string Uj_TagNev { get; set; }
    }

    public class Recept_TagController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public Recept_TagController() { }
        public Recept_TagController(IReceptContext context)
        {
            ctx = context;
        }


        // GET api/<controller>
        public IHttpActionResult Get()
        {
            
                var result = ctx.Recept_Tagek
                    .Include(x => x.Recept)
                    .Include(x => x.Tagek)
                    .Select(x => new ReceptTagModel
                    {
                        R_id = x.R_id,
                        T_id = x.T_id,
                        ReceptNev = x.Recept.Nev,
                        TagNev = x.Tagek.Nev
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
            
                var result = ctx.Recept_Tagek
                    .Include(x => x.Recept)
                    .Include(x => x.Tagek)
                    .Select(x => new ReceptTagModel
                    {
                        R_id = x.R_id,
                        T_id = x.T_id,
                        ReceptNev = x.Recept.Nev,
                        TagNev = x.Tagek.Nev
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
        public IHttpActionResult Post([FromBody] ReceptTagPostModel value)
        {
            try
            {
                var tag = ctx.Tagek
                  .Where(x => x.Nev == value.TagNev)
                  .Select(x => x.Tid)
                  .FirstOrDefault();

                if (tag != null)
                {
                    ctx.Recept_Tagek.Add(
                        new Recept_Tag
                        {
                            R_id = value.R_id,
                            T_id = tag
                        });
                    ctx.SaveChanges();
                }
                return Content(HttpStatusCode.OK, "");
            }
            catch (Exception ex)
            {

                return Content(HttpStatusCode.InternalServerError, ex);
            }
            
              



            




        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] ReceptTagPutModel value)
        {
            //Admin \ Moderátor átírhatja a taget egy recepthez!!!

            
                var recept = ctx.Recept_Tagek
                    .Where(x => x.R_id == id)
                    .FirstOrDefault();

                if(recept!=null)
                {
                    var tid = ctx.Tagek
                        .Where(x => x.Nev == value.TagNev)
                        .Select(x => x.Tid)
                        .FirstOrDefault();

                    ctx.Recept_Tagek.Remove(
                        ctx.Recept_Tagek
                        .Where(x => x.R_id == recept.R_id && x.T_id==tid)
                        .FirstOrDefault());
                    ctx.SaveChanges();
                    
                tid= ctx.Tagek
                        .Where(x => x.Nev == value.Uj_TagNev)
                        .Select(x => x.Tid)
                        .FirstOrDefault();

                ctx.Recept_Tagek.Add(
                        new Recept_Tag
                        {
                            R_id = recept.R_id,
                            T_id = tid,
                        });
                    ctx.SaveChanges();

                    return Content(HttpStatusCode.OK, "");
                }
                else
                {
                    return Content(HttpStatusCode.NotFound, "");
                }

            



        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id, int Rid)
        {
            //Admin \ Moderátor átírhatja a taget egy recepthez!!!
            
                var recept = ctx.Recept_Tagek
                    .Where(x => x.R_id == Rid && x.T_id==id)
                    .FirstOrDefault();

                if (recept != null)
                {
                    ctx.Recept_Tagek.Remove(recept);
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