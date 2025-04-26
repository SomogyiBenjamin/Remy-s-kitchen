using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace BistroRemy.Database
{
    public interface IReceptContext : IDisposable
    {

         DbSet<Kategoria> Kategoriak { get;  }
         DbSet<Felhasznalo> Felhasznalok { get;  }
         DbSet<Recept> Receptek { get;  }
         DbSet<Ertekeles> Ertekelesek { get;  }
         DbSet<Hozzavalo> Hozzavalok { get;  }
         DbSet<Lepes> Lepesek { get;  }
         DbSet<Erzekenyseg> Erzekenysegek { get;  }
         DbSet<Multimedia> Multimediak { get;  }
         DbSet<Tagek> Tagek { get;  }
         DbSet<Recept_Hozzavalo> Recept_Hozzavalok { get;  }
         DbSet<Recept_Tag> Recept_Tagek { get;  }
         DbSet<Felhasznalo_Erzekenyseg> Felhasznalo_Erzekenysegek { get; }
         DbSet<Mertekegyseg> Mertekegysegek { get;  }
         DbSet<Mertekegyseg_Hozzavalo> Mertekegyseg_Hozzavalok { get;  }
        DbSet<Hozzavalo_Erzekenyseg> Hozzavalo_Erzekenysegek { get; }
        DbSet<Izles> Izlesek { get; }
        int SaveChanges();
    }
}