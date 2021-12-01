using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class Route
    {
        public Route(Guid routeId, List<List<double>> coords)
        {
            RouteId = routeId;
            RouteCoords = coords;
        }

        public static string ContainerName = "Route";

        [JsonProperty(PropertyName = "id")]
        public Guid RouteId { get; set; }
        public Guid WalkId { get; set; }
        public string RouteName { get; set; }
        public List<List<double>> RouteCoords { get; set; }
        public List<Hazards> RouteHazards { get; set; }
    }

    public class Hazards
    {
        public Guid HazardId { get; set; }
        public string HazardName { get; set; }
        public string HazardColour { get; set; }
        public List<string> HazardCoords { get; set; }
    }
}
