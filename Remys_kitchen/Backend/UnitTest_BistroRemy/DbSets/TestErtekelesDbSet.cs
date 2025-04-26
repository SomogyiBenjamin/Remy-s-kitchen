using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestErtekelesDbSet : TestDbSet<Ertekeles>
    {

        public override Ertekeles Find(params object[] keyValues)
        {
            return this.SingleOrDefault(ertekeles => ertekeles.Ertid == (int)keyValues.Single());
        }
    }
}
