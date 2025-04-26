using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Multimedia
    {
        [Key]
       public int Vid { get; set; }
       public string URL { get; set; }

        [ForeignKey("Recept")]
        [Column("R_id")]
        public int R_id { get; set; }
        public virtual Recept Recept { get; set; }

    }
}