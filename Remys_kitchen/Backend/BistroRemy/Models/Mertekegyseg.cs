using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Mertekegyseg
    {
        [Key]
        public int Mid { get; set; }
        public string MertekegysegNev { get; set; }
        public virtual ICollection<Recept_Hozzavalo> Recept_Hozzavalo { get; set; }
        public virtual ICollection<Mertekegyseg_Hozzavalo> Mertekegyseg_Hozzavalok { get; set; }


    }
}