using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Ertekeles
    {
        [Key]
        public int Ertid { get; set; }
        public int Csillag { get; set; }

        [ForeignKey("Recept")]
        [Column("R_id")]
        public int R_id { get; set; }
        public virtual Recept Recept { get; set; }

        [ForeignKey("Felhasznalo")]
        [Column("F_id")]
        public int F_id { get; set; }
        public virtual Felhasznalo Felhasznalo { get; set; }

    }
}