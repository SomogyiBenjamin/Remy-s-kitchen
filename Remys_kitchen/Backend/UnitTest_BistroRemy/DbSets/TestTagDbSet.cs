using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestTagDbSet : TestDbSet<Tagek>
    {
        public override Tagek Find(params object[] keyValues)
        {
            return this.SingleOrDefault(tagek => tagek.Tid == (int)keyValues.Single());
        }

    }
}
