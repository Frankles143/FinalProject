using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class Route
    {
        public static string ContainerName = "Route";

        [JsonProperty(PropertyName = "id")]
        public string RouteId { get; set; }
        public string WalkId { get; set; }
        public string RouteName { get; set; }
        public List<string> RouteCoords { get; set; }
        public List<Hazards> RouteHazards { get; set; }
    }

    public class Hazards
    {
        public string HazardId { get; set; }
        public string HazardName { get; set; }
        public string HazardColour { get; set; }
        public List<string> HazardCoords { get; set; }
    }
}
