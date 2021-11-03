using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class Walk
    {
        public static string ContainerName = "Walk";

        [JsonProperty(PropertyName = "id")]
        public string WalkId { get; set; }
        public string WalkName { get; set; }
        public string[] RouteIds { get; set; }
        public List<Flags> Flags { get; set; }
        public List<string> CommentIds { get; set; }
    }

    public class Flags
    {
        public string FlagId { get; set; }
        public string FlagName { get; set; }
        public int FlagTrue { get; set; }
        public int FlagFalse { get; set; }
    }
}
