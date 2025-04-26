using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Mertekegyseg_Hozzavalo
    {
        [ForeignKey("Hozzavalo")]
        [Column("H_id")]
        public int H_id { get; set; }
        public virtual Hozzavalo Hozzavalo { get; set; }


        [ForeignKey("Mertekegyseg")]
        [Column("M_id")]
        public int M_id { get; set; }
        public virtual Mertekegyseg Mertekegyseg { get; set; }

    }
}