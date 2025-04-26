using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestRecept_HozzavaloDbSet : TestDbSet<Recept_Hozzavalo>
    {
        public override Recept_Hozzavalo Find(params object[] keyValues)
        {
            return this.SingleOrDefault(rh => rh.R_id == (int)keyValues.Single());
        }

    }
}
