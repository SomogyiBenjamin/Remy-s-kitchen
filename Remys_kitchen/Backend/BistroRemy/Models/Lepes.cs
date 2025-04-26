using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Lepes
    {
        [Key]
        public int Lid { get; set; }
        public int Sorszam { get; set; }
        public string Leiras { get; set; }

        [ForeignKey("Recept")]
        [Column("R_id")]
        public int R_id { get; set; }
        public virtual Recept Recept { get; set; }

    }
}