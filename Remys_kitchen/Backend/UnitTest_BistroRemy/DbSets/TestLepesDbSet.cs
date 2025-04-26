using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestLepesDbSet : TestDbSet<Lepes>
    {
        public override Lepes Find(params object[] keyValues)
        {
            return this.SingleOrDefault(lepes => lepes.Lid == (int)keyValues.Single());
        }
    }
}
