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
        public string Nehezseg { get; set; }
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
        public string Nehezseg { get; set; }
        public int HozzavaloDb { get; set; }

    }
    public class ReceptPutModel
    {
        public int Rid { get; set; }
        public string Nev { get; set; }
        public string Leiras { get; set; }
        public string KategoriaNev { get; set; }
        public string FelhasznaloNev { get; set; }
        public int Allapot { get; set; }
        public int Eperc { get; set; }
        public bool Szakmai { get; set; }
        public string Nehezseg { get; set; }
        public int HozzavaloDb { get; set; }

    }
    public class AtvaltasModel
    {
        public string mibol { get; set; }
        public string mibe { get; set; }
        public double mennyiseg { get; set; }
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
        public IHttpActionResult Get()
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
                        Szakmai = x.Szakmai,
                        Nehezseg=x.Nehezseg,
                        HozzavaloDb=ctx.Recept_Hozzavalok.Where(y => y.R_id == x.Rid).Count()
                    })
                    .ToList();
            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, result);
            }
        }


        // GET api/<controller>/5
        public IHttpActionResult Get(int id)
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
                        Szakmai = x.Szakmai,
                        Nehezseg=x.Nehezseg
                    })
                    .Where(x => x.Rid == id)
                    .ToList();

            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                return Content(HttpStatusCode.NotFound, result);
            }

        }
        [Route("atvaltas")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] AtvaltasModel value)
        {
            string[] Gs = { "kg", "dkg", "g", "mg" };
            int[] Gtos = { 100, 100, 10, 1000 };
            string[] Ls = { "l", "dl", "cl", "ml" };
            int[] Ltrs = { 10, 10, 10, 10 };
            
            try
            {
                if (Gs.Contains(value.mibol))
                {
                    int IndexOfMibol = Array.IndexOf(Gs, value.mibol);
                    int IndexOfMibe = Array.IndexOf(Gs, value.mibe);
                    if (IndexOfMibe > IndexOfMibol)
                    {
                        for (int i = IndexOfMibol + 1; i <= IndexOfMibe; i++)
                        {
                            value.mennyiseg *= Gtos[i];
                        }
                        return Ok(value.mennyiseg);
                    }
                    else
                    {
                        for (int i = IndexOfMibol; i > IndexOfMibe; i--)
                        {
                            value.mennyiseg /= Gtos[i];
                        }
                        return Ok(value.mennyiseg);
                    }
                }
                else if(Ls.Contains(value.mibol))
                {
                    int IndexOfMibol = Array.IndexOf(Ls, value.mibol);
                    int IndexOfMibe = Array.IndexOf(Ls, value.mibe);
                    if (IndexOfMibe > IndexOfMibol)
                    {
                        for (int i = IndexOfMibol + 1; i <= IndexOfMibe; i++)
                        {
                            value.mennyiseg *= Ltrs[i];
                        }
                        return Ok(value.mennyiseg);
                    }
                    else
                    {
                        for (int i = IndexOfMibol; i > IndexOfMibe; i--)
                        {
                            value.mennyiseg /= Ltrs[i];
                        }
                        return Ok(value.mennyiseg);
                    }
                }
                return Content(HttpStatusCode.NotFound,"Mértékegység nem található");
            }
            catch (Exception)
            {

                return InternalServerError();
            }
           

        }

        //POST api/<controller>
        //public IHttpActionResult Post([FromBody] ReceptPostModel value)
        //{

        //    var kat = ctx.Kategoriak
        //        .Where(x => x.Nev == value.KategoriaNev)
        //        .Select(x => x.Kid)
        //        .FirstOrDefault();

        //    var felh = ctx.Felhasznalok
        //        .Where(x => x.Fnev == value.FelhasznaloNev)
        //        .Select(x => x.Id)
        //        .FirstOrDefault();

        //    try
        //    {
        //        var res = ctx.Receptek.Add(new Recept
        //        {
        //            Nev = value.Nev,
        //            Leiras = value.Leiras,
        //            Szakmai = value.Szakmai,
        //            Eperc = value.Eperc,
        //            K_id = kat,
        //            F_id = felh,
        //            Allapot = 0,
        //            Nehezseg = value.Nehezseg

        //        });
        //        ctx.SaveChanges();
        //        return Content(HttpStatusCode.Created, res);
        //    }
        //    catch
        //    {

        //        return Content(HttpStatusCode.NotFound, "");
        //    }




        //}

        public IHttpActionResult Post([FromBody] ReceptPostModel value)
        {
            var kat = ctx.Kategoriak
                .FirstOrDefault(x => x.Nev == value.KategoriaNev);
            var felh = ctx.Felhasznalok
                .FirstOrDefault(x => x.Fnev == value.FelhasznaloNev);

            try
            {
                var res = ctx.Receptek.Add(new Recept
                {
                    Nev = value.Nev,
                    Leiras = value.Leiras,
                    Szakmai = value.Szakmai,
                    Eperc = value.Eperc,
                    K_id = kat?.Kid ?? 0,
                    F_id = felh?.Id ?? 0,
                    Allapot = 0,
                    Nehezseg = value.Nehezseg,
                    Kategoria = kat, 
                    Felhasznalo = felh 
                });
                ctx.SaveChanges();
                return Content(HttpStatusCode.Created, res);
            }
            catch
            {
                return Content(HttpStatusCode.NotFound, "");
            }
        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] ReceptPutModel value)
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
                recept.Nehezseg = value.Nehezseg;

                ctx.SaveChanges();

                return Content(HttpStatusCode.OK, "");
            }
            
            else return NotFound();

        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var result = ctx.Ertekelesek
                    .Include(x => x.Felhasznalo)
                    .Include(x => x.Recept)
                    .Where(x => x.R_id == id)
                    .ToList();

                if (result.Count != 0)
                {
                    foreach (var item in result)
                    {
                        ctx.Ertekelesek.Remove(item);
                    }
                  
                    ctx.SaveChanges();
                }

                var resultL = ctx.Lepesek
                    .Include(x => x.Recept)
                    .Include(x => x.Recept.Kategoria)
                    .Include(x => x.Recept.Felhasznalo)
                    .Include(x => x.Recept.ReceptHozzavalok)
                    .Where(x => x.R_id == id)
                    .ToList();

                if (resultL.Count!=0)
                {
                    foreach (var item in resultL)
                    {
                        ctx.Lepesek.Remove(item);
                    }
              
                    ctx.SaveChanges();
                }


                var resultM = ctx.Multimediak
                    .Include(x => x.Recept)
                    .Where(x => x.R_id == id)
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
                    .ToList();
                if (resultRH.Count!=0)
                {
                    foreach (var item in resultRH)
                    {
                        ctx.Recept_Hozzavalok.Remove(item);
                    }
                    
                    ctx.SaveChanges();
                }

                var resultRT = ctx.Recept_Tagek
                    .Include(x => x.Recept)
                    .Include(x => x.Tagek)
                    .Where(x => x.R_id == id)
                    .ToList();

                if (resultRT.Count!=0)
                {
                    foreach (var item in resultRT)
                    {
                        ctx.Recept_Tagek.Remove(item);
                    }
               
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

                return Content(HttpStatusCode.OK, "");

            }
            catch (Exception)
            {

                return Content(HttpStatusCode.NotFound, "");
            }
            
                

            




        }
    }
}