using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestReceptDbSet : TestDbSet<Recept>
    {
        public override Recept Find(params object[] keyValues)
        {
            return this.SingleOrDefault(recept => recept.Rid == (int)keyValues.Single());
        }
    }
}
