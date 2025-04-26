using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BistroRemy.Models
{
    public class Tagek
    {
        [Key]
        public int Tid { get; set; }
        public string Nev { get; set; }
    }
}