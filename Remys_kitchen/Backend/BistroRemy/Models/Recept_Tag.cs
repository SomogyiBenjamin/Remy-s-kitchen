using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Recept_Tag
    {
        [ForeignKey("Recept")]
        public int R_id { get; set; }
        public virtual Recept Recept { get; set; }

        [ForeignKey("Tagek")]
        public int T_id { get; set; }
        public virtual Tagek Tagek { get; set; }


    }
}