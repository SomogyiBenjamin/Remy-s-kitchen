using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestMertekegyseg_HozzavaloDbSet : TestDbSet<Mertekegyseg_Hozzavalo>
    {
        public override Mertekegyseg_Hozzavalo Find(params object[] keyValues)
        {
            return this.SingleOrDefault(mh => mh.H_id == (int)keyValues.Single());
        }
    }
}
