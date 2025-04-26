using BistroRemy.Database;
using BistroRemy.Models;
using System.Data.Entity;
using System.Linq;

namespace UnitTest_BistroRemy
{
    class TestReceptContext : IReceptContext
    {
        public DbSet<Kategoria> Kategoriak { get; set; }
        public DbSet<Felhasznalo> Felhasznalok { get; set; }
        public DbSet<Recept> Receptek { get; set; }
        public DbSet<Ertekeles> Ertekelesek { get; set; }
        public DbSet<Hozzavalo> Hozzavalok { get; set; }
        public DbSet<Lepes> Lepesek { get; set; }
        public DbSet<Erzekenyseg> Erzekenysegek { get; set; }
        public DbSet<Multimedia> Multimediak { get; set; }
        public DbSet<Tagek> Tagek { get; set; }
        public DbSet<Recept_Hozzavalo> Recept_Hozzavalok { get; set; }
        public DbSet<Recept_Tag> Recept_Tagek { get; set; }
        public DbSet<Felhasznalo_Erzekenyseg> Felhasznalo_Erzekenysegek { get; set; }
        public DbSet<Mertekegyseg> Mertekegysegek { get; set; }
        public DbSet<Mertekegyseg_Hozzavalo> Mertekegyseg_Hozzavalok { get; set; }
        public DbSet<Hozzavalo_Erzekenyseg> Hozzavalo_Erzekenysegek { get; set; }
        public DbSet<Izles> Izlesek { get; set; }

        public TestReceptContext()
        {
            Kategoriak = new TestKategoriaDbSet();
            Felhasznalok = new TestFelhasznaloDbSet();
            Receptek = new TestReceptDbSet();
            Ertekelesek = new TestErtekelesDbSet();
            Hozzavalok = new TestHozzavaloDbSet();
            Lepesek = new TestLepesDbSet();
            Erzekenysegek = new TestErzekenysegDbSet();
            Multimediak = new TestMultimediaDbSet();
            Tagek = new TestTagDbSet();
            Recept_Hozzavalok = new TestRecept_HozzavaloDbSet();
            Recept_Tagek = new TestRecept_TagDbSet();
            Felhasznalo_Erzekenysegek = new TestFelhasznalo_ErzekenysegDbSet();
            Mertekegysegek = new TestMertekegysegDbSet();
            Mertekegyseg_Hozzavalok = new TestMertekegyseg_HozzavaloDbSet();
            Hozzavalo_Erzekenysegek = new TestHozzavalo_ErzekenysegDbSet();
            Izlesek = new TestIzlesDbSet();
        }

        public void Dispose()
        {
        }

        public int SaveChanges()
        {
            return 0;
        }
    }
}