using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestHozzavaloDbSet : TestDbSet<Hozzavalo>
    {
        public override Hozzavalo Find(params object[] keyValues)
        {
            return this.SingleOrDefault(hozzavalo => hozzavalo.Hid == (int)keyValues.Single());
        }

    }
}
