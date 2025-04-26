using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestIzlesDbSet : TestDbSet<Izles>
    {
        public override Izles Find(params object[] keyValues)
        {
            // A Hozzavalo_Erzekenyseg összetett kulccsal rendelkezik: E_id és H_id
            if (keyValues.Length != 2)
            {
                throw new ArgumentException("Az Ízlés kereséshez pontosan 2 kulcs szükséges (F_id, T_id).");
            }

            int fId = (int)keyValues[0];
            int tId = (int)keyValues[1];

            return this.SingleOrDefault(izles => izles.F_id == fId && izles.T_id == tId);
        }
    }
}
