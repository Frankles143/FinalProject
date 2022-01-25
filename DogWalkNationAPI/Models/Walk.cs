using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class Walk
    {
        public Walk(Guid walkId, string walkName, string walkDesc, List<double> walkCoords)
        {
            WalkId = walkId;
            WalkName = walkName;
            WalkDesc = walkDesc;
            WalkCoords = walkCoords;
        }

        public static string ContainerName = "Walk";

        [JsonProperty(PropertyName = "id")]
        public Guid WalkId { get; set; }
        [JsonProperty(PropertyName = "walkName")]
        public string WalkName { get; set; }
        [JsonProperty(PropertyName = "walkDesc")]
        public string WalkDesc { get; set; }
        [JsonProperty(PropertyName = "walkCoords")]
        public List<double> WalkCoords { get; set; }
        [JsonProperty(PropertyName = "walkRoutes")]
        public List<Guid> WalkRoutes { get; set; }
        [JsonProperty(PropertyName = "walkFlags")]
        public List<Flags> Flags { get; set; }
        [JsonProperty(PropertyName = "walkComments")]
        public List<Guid> CommentIds { get; set; }
    }

    public class NewWalk
    {
        [JsonProperty(PropertyName = "walkName")]
        public string WalkName { get; set; }
        [JsonProperty(PropertyName = "walkDesc")]
        public string WalkDesc { get; set; }
        [JsonProperty(PropertyName = "walkCoords")]
        public List<double> WalkCoords { get; set; }
    }

    public class Flags
    {
        [JsonProperty(PropertyName = "flagId")]
        public string FlagId { get; set; }
        [JsonProperty(PropertyName = "flagName")]
        public string FlagName { get; set; }
        [JsonProperty(PropertyName = "flagTrue")]
        public int FlagTrue { get; set; }
        [JsonProperty(PropertyName = "flagFalse")]
        public int FlagFalse { get; set; }
        [JsonProperty(PropertyName = "flagActive")]
        public bool FlagActive { get; set; }
    }
}
