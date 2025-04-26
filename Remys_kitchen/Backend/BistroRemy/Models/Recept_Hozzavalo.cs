using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Recept_Hozzavalo
    {

        [ForeignKey("Recept")]
        public int R_id { get; set; }
        public virtual Recept Recept { get; set; } 

        [ForeignKey("Hozzavalo")]
        public int H_id { get; set; }
        public virtual Hozzavalo Hozzavalo { get; set; }

        [ForeignKey("Mertekegyseg")]
        public int M_id { get; set; }
        public virtual Mertekegyseg Mertekegyseg { get; set; }

        public double Mennyiseg { get; set; }
        
    }

}