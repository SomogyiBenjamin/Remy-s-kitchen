using BistroRemy.Models;
using BistroRemy.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using BistroRemy.UserManager;

namespace BistroRemy.Controllers
{

    public class FelhasznaloPostModel
    {
        public string Fnev { get; set; }
        public string Email { get; set; }
        public string Jelszo { get; set; }
        public int Jogosultsag { get; set; }
        public string Erzekeny { get; set; }
        public string ProfilkepURL { get; set; }

    }


    public class AuthenticationModel
    {
        public string Email { get; set; }
        public string Jelszo { get; set; }
    }

    public class FelhasznaloAuthModel
    {
        public int id { get; set; }
        public string Fnev { get; set; }
        public string Email { get; set; }
        public int Jogosultsag { get; set; }
        public string ProfilkepURL { get; set; }
    }

    public class FelhasznaloController : ApiController
    {
        private IReceptContext ctx = new ReceptContext();
        public FelhasznaloController() { }
        public FelhasznaloController(IReceptContext context)
        {
            ctx = context;
        }


        // GET api/<controller>
        public IHttpActionResult Get()
        {
  
            
               var result = ctx.Felhasznalok
                    .ToList();

            if (result.Count != 0)
            {
                return Content(HttpStatusCode.OK,result);
            }
            else
            {
                return Content(HttpStatusCode.NoContent, "");
            }

        
        }

        // GET api/<controller>/5
        public IHttpActionResult Get(int id, string email, string jelszo)
        {


            //result = ctx.Felhasznalok
            //    .Where(x => x.Id == id)
            //    .ToList();
            id = 0;
           var result = ctx.Felhasznalok
                .Where(x => x.Email == email)
                .FirstOrDefault();
            if (result != null)
            {
                var valid = PasswordManager.VerifyPasswordHash(jelszo, result.Jelszo_Hash, result.Jelszo_Salt);

                if (valid)
                {
                    return Content(HttpStatusCode.OK, result);
                }
                else
                {
                    return NotFound();
                }
            }
            return NotFound();

        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody] FelhasznaloPostModel value)
        {
            try
            {
                var res = ctx.Felhasznalok
                    .Where(x => x.Fnev == value.Fnev)
                    .FirstOrDefault();

                var resE = ctx.Felhasznalok
                    .Where(x => x.Email == value.Email)
                    .FirstOrDefault();

                if (resE != null) return Content(HttpStatusCode.Conflict, "Az E-mail cím már foglalt");

                if (res != null) return Content(HttpStatusCode.Conflict, "A felhasználónév már foglalt");
                else
                {
                    PasswordManager.CreatePasswordHash(value.Jelszo, out byte[] hash, out byte[] salt);
                    ctx.Felhasznalok.Add(new Felhasznalo
                    {
                        Fnev = value.Fnev,
                        Email = value.Email,
                        Jelszo_Hash = hash,
                        Jelszo_Salt = salt,
                        Jogosultsag = value.Jogosultsag,
                        ProfilkepURL = value.ProfilkepURL

                    });
                    ctx.SaveChanges();
                    if (value.Erzekeny != "")
                    {
                        int ERZid = ctx.Erzekenysegek
                            .Where(x => x.Nev == value.Erzekeny)
                            .Select(x => x.Eid)
                            .FirstOrDefault();
                        int FELid = ctx.Felhasznalok
                            .Where(x => x.Fnev == value.Fnev)
                            .Select(x => x.Id)
                            .FirstOrDefault();
                        ctx.Felhasznalo_Erzekenysegek.Add(new Felhasznalo_Erzekenyseg
                        {
                            F_id = FELid,
                            E_id = ERZid
                        });
                        ctx.SaveChanges();
                    }

                    return Ok();
                }
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }
                

        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody] FelhasznaloPostModel value)
        {
            try
            {
                var res = ctx.Felhasznalok
                    .Where(x => x.Id == id)
                    .FirstOrDefault();

                if (res != null)
                {
                    res.Fnev = value.Fnev;
                    res.Email = value.Email;
                    PasswordManager.CreatePasswordHash(value.Jelszo, out byte[] hash, out byte[] salt);
                    res.Jelszo_Hash = hash;
                    res.Jelszo_Salt = salt;
                    res.Jogosultsag = value.Jogosultsag;
                    res.ProfilkepURL = value.ProfilkepURL;

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

        [HttpPatch]
        public IHttpActionResult Patch(int id, [FromBody] FelhasznaloPostModel value)
        {
            var res = ctx.Felhasznalok
                .Where(x => x.Id == id)
                .FirstOrDefault();
            try
            {
                if (res != null)
                {
                    if (!string.IsNullOrEmpty(value.Email)) res.Email = value.Email;
                    if (!string.IsNullOrEmpty(value.Fnev)) res.Fnev = value.Fnev;
                    if (!string.IsNullOrEmpty(value.Jelszo))
                    {
                        PasswordManager.CreatePasswordHash(value.Jelszo, out byte[] hash, out byte[] salt);
                        res.Jelszo_Hash = hash;
                        res.Jelszo_Salt = salt;
                    }
                    if (value.Jogosultsag != 0) res.Jogosultsag = value.Jogosultsag;
                    if (!string.IsNullOrEmpty(value.ProfilkepURL)) res.ProfilkepURL = value.ProfilkepURL;
                    ctx.SaveChanges();
                    return Ok("Sikeres adatmódosítás");
                }
                return NotFound();
   
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {

            var result = ctx.Felhasznalok
                    .Where(x => x.Id == id)
                    .FirstOrDefault();
            var felhErz = ctx.Felhasznalo_Erzekenysegek
                .Where(x => x.F_id == id)
                .ToList();

            var receptController = new ReceptController(ctx);
            var receptek = ctx.Receptek
                .Where(x => x.F_id == id)
                .ToList();

            var izles = ctx.Izlesek
                .Where(x => x.F_id == id)
                .ToList();
            
            foreach (var item in izles)
            {
                ctx.Izlesek.Remove(item);
                ctx.SaveChanges();
            }
            foreach (var item in receptek)
            {
                receptController.Delete(item.Rid);
            }

            foreach (var item in felhErz)
            {
                ctx.Felhasznalo_Erzekenysegek.Remove(item);
            }
                if (result != null)
                {
                    ctx.Felhasznalok.Remove(result);
                    ctx.SaveChanges();
                    return Ok();
                }
                else
                {
                    return NotFound();
                }

               
            
       

               
            
               
        }

        //public IHttpActionResult Patch(int id, [FromBody] FelhasznaloPatchtModel value)
        //{
        //    try
        //    {
        //        var res = ctx.Felhasznalok
        //            .Where(x => x.Id == id)
        //            .FirstOrDefault();

        //        if (res != null)
        //        {
        //            if (value.Jelszo != "")
        //            {
        //                PasswordManager.CreatePasswordHash(value.Jelszo, out byte[] hash, out byte[] salt);
        //                res.Jelszo_Hash = hash;
        //                res.Jelszo_Salt = salt;
        //            }

        //            if(value.ProfilkepURL!="") res.ProfilkepURL = value.ProfilkepURL;

        //            ctx.SaveChanges();
        //            return Ok();
        //        }
        //        else
        //        {
        //            return NotFound();
        //        }
            
        //    }
        //    catch (Exception)
        //    {

        //        return InternalServerError();
        //    }


        //}

        [HttpPost]
        [Route("api/Felhasznalo/authenticate")]
        public IHttpActionResult Authenticate([FromBody] AuthenticationModel value)
        {
            
                var result = ctx.Felhasznalok
                    .Where(x => x.Email == value.Email)
                    .FirstOrDefault();
                if (result != null)
                {
                    var valid = PasswordManager.VerifyPasswordHash(value.Jelszo, result.Jelszo_Hash, result.Jelszo_Salt);
                    var response = ctx.Felhasznalok
                    .Where(x => x.Email == value.Email)
                    .Select(x => new FelhasznaloAuthModel
                    {
                        id=x.Id,
                        Fnev = x.Fnev,
                        Email = x.Email,
                        Jogosultsag = x.Jogosultsag,
                        ProfilkepURL = x.ProfilkepURL
                    })
                    .FirstOrDefault();

                    if (valid)
                        return Ok(response);
                    else
                        return Unauthorized();

                }
                return NotFound();
            
        }
    }
}