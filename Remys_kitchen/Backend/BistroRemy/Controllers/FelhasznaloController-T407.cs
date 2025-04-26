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
        public HttpResponseMessage Get()
        {
  
            
               var result = ctx.Felhasznalok
                    .ToList();

            if (result.Count != 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK,result);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }

        
        }

        // GET api/<controller>/5
        public HttpResponseMessage Get(int id, string email, string jelszo)
        {


            //result = ctx.Felhasznalok
            //    .Where(x => x.Id == id)
            //    .ToList();
            id = 0;
           var result = ctx.Felhasznalok
                .Where(x => x.Email == email)
                .FirstOrDefault();
            var valid = PasswordManager.VerifyPasswordHash(jelszo, result.Jelszo_Hash, result.Jelszo_Salt);

            if (valid)
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        // POST api/<controller>
        public HttpResponseMessage Post([FromBody] FelhasznaloPostModel value)
        {
            try
            {
                PasswordManager.CreatePasswordHash(value.Jelszo, out byte[] hash, out byte[] salt);
                ctx.Felhasznalok.Add(new Felhasznalo
                {
                    Fnev = value.Fnev,
                    Email = value.Email,
                    Jelszo_Hash=hash,
                    Jelszo_Salt=salt,
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

                return Request.CreateResponse(HttpStatusCode.Created);
            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
                

        }

        // PUT api/<controller>/5
        public HttpResponseMessage Put(int id, [FromBody] FelhasznaloPostModel value)
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
                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.NotModified);
            }
                
                
        }

        // DELETE api/<controller>/5
        public HttpResponseMessage Delete(int id)
        {

            var result = ctx.Felhasznalok
                    .Where(x => x.Id == id)
                    .FirstOrDefault();

                if (result != null)
                {
                    ctx.Felhasznalok.Remove(result);
                    ctx.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

               
            
       

               
            
               
        }
        [HttpPost]
        [Route("api/Felhasznalo/authenticate")]
        public HttpResponseMessage Authenticate([FromBody] AuthenticationModel value)
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
                        return Request.CreateResponse(HttpStatusCode.OK, response);
                    else
                        return Request.CreateResponse(HttpStatusCode.Unauthorized);

                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            
        }
    }
}