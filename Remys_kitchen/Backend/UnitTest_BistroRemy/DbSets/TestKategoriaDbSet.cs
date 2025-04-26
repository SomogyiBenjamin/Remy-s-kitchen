using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestKategoriaDbSet : TestDbSet<Kategoria>
    {
        public override Kategoria Find(params object[] keyValues)
        {
            return this.SingleOrDefault(kategoria => kategoria.Kid == (int)keyValues.Single());
        }
    }
}
