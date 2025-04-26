using BistroRemy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest_BistroRemy
{
    class TestMultimediaDbSet : TestDbSet<Multimedia>
    {
        public override Multimedia Find(params object[] keyValues)
        {
            return this.SingleOrDefault(multimedia => multimedia.Vid == (int)keyValues.Single());
        }

    }
}
