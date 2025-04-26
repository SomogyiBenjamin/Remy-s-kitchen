using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Recept
    {
        [Key]
        public int Rid { get; set; }
        public string Nev { get; set; }
        public string Leiras { get; set; }
        public int Allapot { get; set; }
        public bool Szakmai { get; set; }
        public int Eperc { get; set; }
        public string Nehezseg { get; set; }


        [ForeignKey("Kategoria")]
        [Column("K_id")]
        public int K_id { get; set; }
        public virtual Kategoria Kategoria { get; set; }

        [ForeignKey("Felhasznalo")]
        [Column("F_id")]
        public int F_id { get; set; }
        public virtual Felhasznalo Felhasznalo { get; set; }

        public virtual ICollection<Recept_Hozzavalo> ReceptHozzavalok { get; set; }
        public virtual ICollection<Recept_Tag> RecepTagek { get; set; }
    }
}