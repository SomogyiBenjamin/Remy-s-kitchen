using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Hozzavalo
    {
        [Key]
        public int Hid { get; set; }
        public string Nev { get; set; }
        public virtual ICollection<Recept_Hozzavalo> ReceptHozzavalok { get; set; }
    }
}