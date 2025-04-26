using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestFelhasznalo_ErzekenysegDbSet : TestDbSet<Felhasznalo_Erzekenyseg>
    {
        public override Felhasznalo_Erzekenyseg Find(params object[] keyValues)
        {
            return this.SingleOrDefault(fe => fe.F_id == (int)keyValues.Single());
        }

    }
}
