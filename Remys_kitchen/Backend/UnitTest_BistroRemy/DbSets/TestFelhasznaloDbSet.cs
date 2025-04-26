using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestFelhasznaloDbSet : TestDbSet<Felhasznalo>
    {
        public override Felhasznalo Find(params object[] keyValues)
        {
            return this.SingleOrDefault(felhasznalo => felhasznalo.Id == (int)keyValues.Single());
        }

    }
}
