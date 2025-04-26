using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Hozzavalo_Erzekenyseg
    {

        [ForeignKey("Hozzavalo")]
        public int H_id { get; set; }
        public virtual Hozzavalo Hozzavalo { get; set; }

        [ForeignKey("Erzekenyseg")]
        public int E_id { get; set; }
        public virtual Erzekenyseg Erzekenyseg { get; set; }


    }
}