using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Felhasznalo
    {
        public int Id { get; set; }
        public string Fnev { get; set; }
        public string Email { get; set; }
        public byte[] Jelszo_Hash { get; set; }
        public byte[] Jelszo_Salt { get; set; }
        public int Jogosultsag { get; set; }
        public string ProfilkepURL { get; set; }
    }
}