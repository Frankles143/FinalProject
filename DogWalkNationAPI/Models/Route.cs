using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class Route
    {
        public Route(Guid routeId, List<List<double>> routeCoords)
        {
            RouteId = routeId;
            RouteCoords = routeCoords;
        }

        [JsonConstructor]
        public Route(Guid routeId, string routeName, List<List<double>> routeCoords, List<Hazard> routeHazards)
        {
            RouteId = routeId;
            RouteName = routeName;
            RouteCoords = routeCoords;
            RouteHazards = routeHazards;
        }

        public static string ContainerName = "Route";

        [JsonProperty(PropertyName = "id")]
        public Guid RouteId { get; set; }
        [JsonProperty(PropertyName = "routeName")]
        public string RouteName { get; set; }
        [JsonProperty(PropertyName = "routeCoords")]
        public List<List<double>> RouteCoords { get; set; }
        [JsonProperty(PropertyName = "routeHazards")]
        public List<Hazard> RouteHazards { get; set; }
    }

    public class RouteIds
    {
        [JsonProperty(PropertyName = "ids")]
        public List<Guid> Ids { get; set; }
    }

    public class Hazard
    {
        public Hazard(Guid hazardId, string hazardName, string hazardColour, List<List<double>> hazardCoords)
        {
            HazardId = hazardId;
            HazardName = hazardName;
            HazardColour = hazardColour;
            HazardCoords = hazardCoords;
        }

        [JsonProperty(PropertyName = "hazardId")]
        public Guid HazardId { get; set; }
        [JsonProperty(PropertyName = "hazardName")]
        public string HazardName { get; set; }
        [JsonProperty(PropertyName = "hazardColour")]
        public string HazardColour { get; set; }
        [JsonProperty(PropertyName = "hazardCoords")]
        public List<List<double>> HazardCoords { get; set; }
    }
}
