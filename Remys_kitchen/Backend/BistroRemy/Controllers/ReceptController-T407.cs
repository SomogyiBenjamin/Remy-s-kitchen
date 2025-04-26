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
    public class ReceptPostModel
    {
        public string Nev { get; set; }
        public string Leiras { get; set; }
        public bool Szakmai { get; set; }
        public int Eperc { get; set; }
        public string KategoriaNev { get; set; }
        public string FelhasznaloNev { get; set; }
    }


    public class ReceptModel
    {
        public int Rid { get; set; }
        public string Nev { get; set; }
        public string Leiras { get; set; }
        public string KategoriaNev { get; set; }
        public string FelhasznaloNev { get; set; }
        public int Allapot { get; set; }
        public int Eperc { get; set; }
        public bool Szakmai { get; set; }

    }

    public class ReceptController : ApiController
    {

        private IReceptContext ctx = new ReceptContext();
        public ReceptController() { }
        public ReceptController(IReceptContext context)
        {
            ctx = context;
        }

        // GET api/<controller>
        public HttpResponseMessage Get()
        {
            var result = ctx.Receptek
                    .Include(x => x.Felhasznalo)
                    .Include(x => x.Kategoria)
                    .Select(x => new ReceptModel
                    {
                        Rid = x.Rid,
                        Nev = x.Nev,
                        Leiras = x.Leiras,
                        KategoriaNev = x.Kategoria.Nev,
                        FelhasznaloNev = x.Felhasznalo.Fnev,
                        Allapot = x.Allapot,
                        Eperc = x.Eperc,
                        Szakmai = x.Szakmai
                    })
                    .ToList();
            if (result.Count != 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.NoContent, result);
            }
        }


        // GET api/<controller>/5
        public HttpResponseMessage Get(int id)
        {
            
                var result = ctx.Receptek
                    .Include(x => x.Felhasznalo)
                    .Include(x => x.Kategoria)
                    .Select(x => new ReceptModel
                    {
                        Rid = x.Rid,
                        Nev = x.Nev,
                        Leiras = x.Leiras,
                        KategoriaNev = x.Kategoria.Nev,
                        FelhasznaloNev = x.Felhasznalo.Fnev,
                        Allapot = x.Allapot,
                        Eperc = x.Eperc,
                        Szakmai = x.Szakmai
                    })
                    .Where(x => x.Rid == id)
                    .ToList();

            if (result.Count != 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, result);
            }

        }

        // POST api/<controller>
        public HttpResponseMessage Post([FromBody] ReceptPostModel value)
        {
           
                var kat = ctx.Kategoriak
                    .Where(x => x.Nev == value.KategoriaNev)
                    .Select(x => x.Kid)
                    .FirstOrDefault();

                var felh = ctx.Felhasznalok
                    .Where(x => x.Fnev == value.FelhasznaloNev)
                    .Select(x => x.Id)
                    .FirstOrDefault();

            try
            {
                var res = ctx.Receptek.Add(new Recept
                {
                    Nev = value.Nev,
                    Leiras = value.Leiras,
                    Szakmai = value.Szakmai,
                    Eperc = value.Eperc,
                    K_id = kat,
                    F_id = felh,
                    Allapot = 0
                });
                ctx.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.Created, res);
            }
            catch
            {

                return Request.CreateResponse(HttpStatusCode.NotFound);
            }


               
            
        }

        // PUT api/<controller>/5
        public HttpResponseMessage Put(int id, [FromBody] ReceptModel value)
        {
           var recept= ctx.Receptek
                .Where(x => x.Rid == id)
                .FirstOrDefault();

            if (recept != null)
            {
                var katId = ctx.Kategoriak
                    .Where(x => x.Nev == value.KategoriaNev)
                    .Select(x => x.Kid)
                    .FirstOrDefault();

                var felhId = ctx.Felhasznalok
                    .Where(x => x.Fnev == value.FelhasznaloNev)
                    .Select(x => x.Id)
                    .FirstOrDefault();

                recept.K_id = katId;
                recept.Leiras = value.Leiras;
                recept.Nev = value.Nev;
                recept.Rid = recept.Rid;
                recept.Szakmai = value.Szakmai;
                recept.Allapot = value.Allapot;
                recept.Eperc = value.Eperc;
                recept.F_id = felhId;

                ctx.SaveChanges();

               
            }
            return Request.CreateResponse(HttpStatusCode.OK);

        }

        // DELETE api/<controller>/5
        public HttpResponseMessage Delete(int id)
        {
            try
            {
                var result = ctx.Ertekelesek
                    .Include(x => x.Felhasznalo)
                    .Include(x => x.Recept)
                    .Where(x => x.R_id == id)
                    .FirstOrDefault();

                if (result != null)
                {
                    ctx.Ertekelesek.Remove(result);
                    ctx.SaveChanges();
                }

                var resultL = ctx.Lepesek
                    .Include(x => x.Recept)
                    .Include(x => x.Recept.Kategoria)
                    .Include(x => x.Recept.Felhasznalo)
                    .Include(x => x.Recept.ReceptHozzavalok)
                    .Where(x => x.R_id == id)
                    .FirstOrDefault();

                if (resultL != null)
                {
                    ctx.Lepesek.Remove(resultL);
                    ctx.SaveChanges();
                }


                var resultM = ctx.Multimediak
                    .Include(x => x.Recept)
                    .Where(x => x.Vid == id)
                    .FirstOrDefault();

                if (resultM != null)
                {
                    ctx.Multimediak.Remove(resultM);
                    ctx.SaveChanges();
                }

                var resultRH = ctx.Recept_Hozzavalok
                    .Include(x => x.Recept)
                    .Include(x => x.Recept.Kategoria)
                    .Include(x => x.Recept.Felhasznalo)
                    .Include(x => x.Hozzavalo)
                    .Where(x => x.R_id == id)
                    .FirstOrDefault();
                if (resultRH != null)
                {
                    ctx.Recept_Hozzavalok.Remove(resultRH);
                    ctx.SaveChanges();
                }

                var resultRT = ctx.Recept_Tagek
                    .Include(x => x.Recept)
                    .Include(x => x.Tagek)
                    .Where(x => x.R_id == id)
                    .FirstOrDefault();

                if (resultRT != null)
                {
                    ctx.Recept_Tagek.Remove(resultRT);
                    ctx.SaveChanges();
                }

                var resultR = ctx.Receptek
                    .Include(x => x.Felhasznalo)
                    .Include(x => x.Kategoria)
                    .Where(x => x.Rid == id)
                    .FirstOrDefault();
                if (resultR != null)
                {
                    ctx.Receptek.Remove(resultR);
                    ctx.SaveChanges();
                }

                return Request.CreateResponse(HttpStatusCode.OK);

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            
                

            




        }
    }
}