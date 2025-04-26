using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestRecept_TagDbSet : TestDbSet<Recept_Tag>
    {
        public override Recept_Tag Find(params object[] keyValues)
        {
            return this.SingleOrDefault(rt => rt.R_id == (int)keyValues.Single());
        }

    }
}
