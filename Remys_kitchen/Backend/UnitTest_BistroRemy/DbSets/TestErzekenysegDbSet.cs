using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestErzekenysegDbSet : TestDbSet<Erzekenyseg>
    {
        public override Erzekenyseg Find(params object[] keyValues)
        {
            return this.SingleOrDefault(erzekenyseg => erzekenyseg.Eid == (int)keyValues.Single());
        }

    }
}
