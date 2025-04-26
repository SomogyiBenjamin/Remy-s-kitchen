using BistroRemy.Models;
using System;
using System.Linq;

namespace UnitTest_BistroRemy
{
    class TestHozzavalo_ErzekenysegDbSet : TestDbSet<Hozzavalo_Erzekenyseg>
    {
        public override Hozzavalo_Erzekenyseg Find(params object[] keyValues)
        {
            // A Hozzavalo_Erzekenyseg összetett kulccsal rendelkezik: E_id és H_id
            if (keyValues.Length != 2)
            {
                throw new ArgumentException("A Hozzavalo_Erzekenyseg kereséshez pontosan 2 kulcs szükséges (E_id, H_id).");
            }

            int eId = (int)keyValues[0];
            int hId = (int)keyValues[1];

            return this.SingleOrDefault(he => he.E_id == eId && he.H_id == hId);
        }
    }
}