using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Kategoria
    {
        [Key]
        public int Kid { get; set; }
        public string Nev { get; set; }
    }
}