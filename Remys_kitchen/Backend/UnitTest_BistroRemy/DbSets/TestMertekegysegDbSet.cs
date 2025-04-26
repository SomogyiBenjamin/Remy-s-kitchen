using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestMertekegysegDbSet : TestDbSet<Mertekegyseg>
    {
        public override Mertekegyseg Find(params object[] keyValues)
        {
            return this.SingleOrDefault(m => m.Mid == (int)keyValues.Single());
        }
    }
}
