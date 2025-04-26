using BistroRemy.Controllers;
using BistroRemy.Models;
using BistroRemy.UserManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    public class DemosClass
    {
        public Izles IzlesDemo(int instances)
        {
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo= new Felhasznalo
            {
                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = "Demo.jpg"
            };
            var tag = new Tagek
            {
                Tid = 1 + instances,
                Nev = "Demo" + instances
            };

            return new Izles
            {
                T_id = tag.Tid,
                F_id = felhasznalo.Id
            };
        }
        public Felhasznalo FelhasznaloDemo(int instances)
        {
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            return new Felhasznalo
            {
                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = "Demo.jpg"
            };
        }
        public Kategoria KategoriaDemos(int instances)
        {
            return new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
        }
        public Recept ReceptDemos(int instances)
        {
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            return new Recept
            {

                Kategoria = new Kategoria
                {
                    Kid = 1 + instances,
                    Nev = "Demo" + instances
                },
                Felhasznalo = new Felhasznalo
                {
                    Id = 1 + instances,
                    Fnev = "Demo" + instances,
                    Email = "DemoEmailt",
                    Jelszo_Salt = salt,
                    Jelszo_Hash = hash,
                    Jogosultsag = 1,
                    ProfilkepURL = ""
                },
                //RecepTagek = new Recept_Tag
                //{
                //    R_id=1+instances,
                //    T_id=1+instances,

                //}
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Nehezseg = "konnyu"

            };
        }
        public Ertekeles ErtekelesDemos(int instances)
        {
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            return new Ertekeles
            {
                Ertid = 1 + instances,
                Csillag = 4,
                R_id = 1 + instances,
                F_id = 1 + instances,
                Recept = new Recept
                {
                    Rid = 1 + instances,
                    Nev = "Demo" + instances,
                    Leiras = "Demo" + instances,
                    Allapot = 1,
                    Szakmai = false,
                    Eperc = 90,
                    K_id = 1 + instances,
                    F_id = 1 + instances,
                    Nehezseg = "konnyu",

                },
                Felhasznalo = new Felhasznalo
                {
                    Id = 1 + instances,
                    Fnev = "Demo" + instances,
                    Email = "DemoEmailt",
                    Jelszo_Hash = hash,
                    Jelszo_Salt = salt,
                    Jogosultsag = 1,
                    ProfilkepURL = ""
                }

            };
        }
        public Hozzavalo HozzavaloDemos(int instances)
        {
            var kategoria = new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {

                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = ""
            };

            var recept = new Recept
            {
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Kategoria = kategoria,
                Felhasznalo = felhasznalo
            };

            var hozzavalo = new Hozzavalo
            {
                Hid = 1 + instances,
                Nev = "Demo" + instances
            };

            var mertekegyseg = new Mertekegyseg
            {
                Mid = 1 + instances,
                MertekegysegNev = "Demo" + instances,
            };
            var mertekegysegHozzavalo = new Mertekegyseg_Hozzavalo
            {
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg
            };
            var receptHozzavalo = new Recept_Hozzavalo
            {
                R_id = 1 + instances,
                Recept = recept,
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg,
                Mennyiseg = 1 + instances,


            };


            hozzavalo.ReceptHozzavalok = new List<Recept_Hozzavalo> { receptHozzavalo };
            return hozzavalo;
        }
        public Tagek TagDemos(int instances)
        {
            return new Tagek
            {
                Tid = 1 + instances,
                Nev = "Demo" + instances
            };
        }
        public Multimedia MultimediaDemos(int instances)
        {
            var kategoria = new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {

                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = ""
            };
            var recept = new Recept
            {
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Kategoria = kategoria,
                Felhasznalo = felhasznalo
            };
            return new Multimedia
            {
                Vid = 1 + instances,
                URL = "Demo" + instances,
                R_id = felhasznalo.Id,
                Recept = recept
            };
        }
        public Lepes LepesDemos(int instances)
        {
            var kategoria = new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {

                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = ""
            };
            var recept = new Recept
            {
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Kategoria = kategoria,
                Felhasznalo = felhasznalo
            };

            return new Lepes
            {
                Lid = 1 + instances,
                Leiras = "Demo" + instances,
                R_id = 1 + instances,
                Recept = recept,
                Sorszam=1+instances
            };


        }
        public Erzekenyseg ErzekenysegDemos(int instances)
        {
            return new Erzekenyseg
            {
                Eid = 1 + instances,
                Nev = "Demo" + instances
            };

        }
        public Mertekegyseg MertekegysegDemos(int instances)
        {
            var kategoria = new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {

                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = ""
            };

            var recept = new Recept
            {
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Kategoria = kategoria,
                Felhasznalo = felhasznalo
            };

            var hozzavalo = new Hozzavalo
            {
                Hid = 1 + instances,
                Nev = "Demo" + instances
            };

            var mertekegyseg = new Mertekegyseg
            {
                Mid = 1 + instances,
                MertekegysegNev = "Demo" + instances,
            };
            var mertekegysegHozzavalo = new Mertekegyseg_Hozzavalo
            {
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg
            };
            var receptHozzavalo = new Recept_Hozzavalo
            {
                R_id = 1 + instances,
                Recept = recept,
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg,
                Mennyiseg = 1 + instances,


            };
            return new Mertekegyseg
            {
                Mid = 1 + instances,
                MertekegysegNev = "Demo" + instances,
                Recept_Hozzavalo = new List<Recept_Hozzavalo> { receptHozzavalo },
                Mertekegyseg_Hozzavalok = new List<Mertekegyseg_Hozzavalo> { mertekegysegHozzavalo }
            };

        }
        public Felhasznalo_Erzekenyseg Felhasznalo_ErzekenysegDemos(int instances)
        {
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {
                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = "Demo.jpg"
            };
            var erzekenyseg = new Erzekenyseg
            {
                Eid = 1 + instances,
                Nev = "Demo" + instances
            };
            return new Felhasznalo_Erzekenyseg
            {
                F_id = 1 + instances,
                E_id = 1 + instances,
                Felhasznalo = felhasznalo,
                Erzekenyseg = erzekenyseg
            };
        }
        public Hozzavalo_Erzekenyseg Hozzavalo_ErzekenysegDemos(int instances)
        {
            var kategoria = new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {

                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = ""
            };

            var recept = new Recept
            {
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Kategoria = kategoria,
                Felhasznalo = felhasznalo
            };

            var hozzavalo = new Hozzavalo
            {
                Hid = 1 + instances,
                Nev = "Demo" + instances
            };

            var mertekegyseg = new Mertekegyseg
            {
                Mid = 1 + instances,
                MertekegysegNev = "Demo" + instances,
            };
            var mertekegysegHozzavalo = new Mertekegyseg_Hozzavalo
            {
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg
            };
            mertekegyseg.Mertekegyseg_Hozzavalok = new List<Mertekegyseg_Hozzavalo> { mertekegysegHozzavalo };
            var receptHozzavalo = new Recept_Hozzavalo
            {
                R_id = 1 + instances,
                Recept = recept,
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg,
                Mennyiseg = 1 + instances,


            };
            mertekegyseg.Recept_Hozzavalo = new List<Recept_Hozzavalo> { receptHozzavalo };
            var erzekenyseg = new Erzekenyseg
            {
                Eid = 1 + instances,
                Nev = "Demo" + instances
            };

            hozzavalo.ReceptHozzavalok = new List<Recept_Hozzavalo> { receptHozzavalo };
            recept.ReceptHozzavalok = new List<Recept_Hozzavalo> { receptHozzavalo };
      
            return new Hozzavalo_Erzekenyseg
            {
                H_id = 1 + instances,
                E_id = 1 + instances,
                Hozzavalo = hozzavalo,
                Erzekenyseg = erzekenyseg
            };
        }
        public Mertekegyseg_Hozzavalo Mertekegyseg_HozzavaloDemos(int instances)
        {
            var kategoria = new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {

                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = ""
            };

            var recept = new Recept
            {
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Kategoria = kategoria,
                Felhasznalo = felhasznalo
            };

            var hozzavalo = new Hozzavalo
            {
                Hid = 1 + instances,
                Nev = "Demo" + instances
            };

            var mertekegyseg = new Mertekegyseg
            {
                Mid = 1 + instances,
                MertekegysegNev = "Demo" + instances,
            };
            var mertekegysegHozzavalo = new Mertekegyseg_Hozzavalo
            {
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg
            };
            var receptHozzavalo = new Recept_Hozzavalo
            {
                R_id = 1 + instances,
                Recept = recept,
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg,
                Mennyiseg = 1 + instances,


            };
            hozzavalo.ReceptHozzavalok = new List<Recept_Hozzavalo> { receptHozzavalo };
            mertekegyseg = new Mertekegyseg
            {
                Mid = 1 + instances,
                MertekegysegNev = "Demo" + instances,
                Recept_Hozzavalo = new List<Recept_Hozzavalo> { receptHozzavalo },
                Mertekegyseg_Hozzavalok = new List<Mertekegyseg_Hozzavalo> { mertekegysegHozzavalo }
            };
            return new Mertekegyseg_Hozzavalo
            {
                H_id = 1 + instances,
                M_id = 1 + instances,
                Hozzavalo = hozzavalo,
                Mertekegyseg = mertekegyseg
            };
        }
        public Recept_Hozzavalo Recept_HozzavaloDemos(int instances)
        {
            var kategoria = new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {
                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = ""
            };
            var recept = new Recept
            {
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Kategoria = kategoria,
                Felhasznalo = felhasznalo
            };
            var hozzavalo = new Hozzavalo
            {
                Hid = 1 + instances,
                Nev = "Demo" + instances
            };
            var mertekegyseg = new Mertekegyseg
            {
                Mid = 1 + instances,
                MertekegysegNev = "Demo" + instances,
            };
            var mertekegysegHozzavalo = new Mertekegyseg_Hozzavalo
            {
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg
            };
            var receptHozzavalo = new Recept_Hozzavalo
            {
                R_id = 1 + instances,
                Recept = recept,
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg,
                Mennyiseg = 1 + instances,
            };

            return new Recept_Hozzavalo
            {
                R_id = 1 + instances,
                Recept = recept,
                H_id = 1 + instances,
                Hozzavalo = hozzavalo,
                M_id = 1 + instances,
                Mertekegyseg = mertekegyseg,
                Mennyiseg = 1 + instances,
            };
        }
        public Recept_Tag Recept_TagDemos(int instances)
        {
            var kategoria = new Kategoria
            {
                Kid = 1 + instances,
                Nev = "Demo" + instances
            };
            PasswordManager.CreatePasswordHash("Demo", out byte[] hash, out byte[] salt);
            var felhasznalo = new Felhasznalo
            {
                Id = 1 + instances,
                Fnev = "Demo" + instances,
                Email = "DemoEmailt",
                Jelszo_Hash = hash,
                Jelszo_Salt = salt,
                Jogosultsag = 1,
                ProfilkepURL = ""
            };
            var recept = new Recept
            {
                Rid = 1 + instances,
                Nev = "Demo" + instances,
                Leiras = "Demo" + instances,
                Allapot = 1,
                Szakmai = false,
                Eperc = 90,
                K_id = 1 + instances,
                F_id = 1 + instances,
                Kategoria = kategoria,
                Felhasznalo = felhasznalo
            };
            var tag = new Tagek
            {
                Tid = 1 + instances,
                Nev = "Demo" + instances
            };
            return new Recept_Tag
            {
                R_id = 1 + instances,
                T_id = 1 + instances,
                Recept = recept,
                Tagek = tag
            };
        }
    }
}
