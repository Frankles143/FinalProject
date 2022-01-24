using DogWalkNationAPI.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Services
{
    public class Responses
    {
        public class Default
        {
            [JsonProperty]
            public bool Success { get; set; }
            [JsonProperty]
            public string Message { get; set; }
            [JsonIgnore]
            [System.Text.Json.Serialization.JsonIgnore]
            public HttpStatusCode StatusCode { get; set; }

        }

        public class DefaultWithUser : Default
        {
            [JsonProperty]
            public User User { get; set; }
        }
        public class DefaultWithUserAndToken : DefaultWithUser
        {
            [JsonProperty]
            public string Token { get; set; }
        }

        public class DefaultWithRoutes : Default
        {
            [JsonProperty]
            public List<Route> Routes { get; set; }
        }
    }
}
