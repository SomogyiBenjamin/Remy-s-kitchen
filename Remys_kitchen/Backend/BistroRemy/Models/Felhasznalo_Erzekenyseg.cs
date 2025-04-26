using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Felhasznalo_Erzekenyseg
    {
        [ForeignKey("Felhasznalo")]
        public int F_id { get; set; }
        public virtual Felhasznalo Felhasznalo { get; set; }

        [ForeignKey("Erzekenyseg")]
        public int E_id { get; set; }
        public virtual Erzekenyseg Erzekenyseg { get; set; }

    }
}