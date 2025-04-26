using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;

namespace BistroRemy.Database
{
    public class ReceptContext : DbContext, IReceptContext
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
        public ReceptContext() : base("name=ReceptContext") { }

        public ReceptContext(DbConnection existingConnection, bool contextOwnsConnection)
                : base(existingConnection, contextOwnsConnection) { }
       
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<Recept_Hozzavalo>()
            .HasKey(rh => new { rh.R_id, rh.H_id });

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Recept_Tag>()
            .HasKey(x => new { x.R_id, x.T_id });

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Felhasznalo_Erzekenyseg>()
           .HasKey(x => new { x.F_id, x.E_id });

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Mertekegyseg_Hozzavalo>()
           .HasKey(x => new { x.M_id, x.H_id });

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Hozzavalo_Erzekenyseg>()
           .HasKey(x => new { x.E_id, x.H_id });

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Izles>()
           .HasKey(x => new { x.T_id, x.F_id });

        }

       
    }
}