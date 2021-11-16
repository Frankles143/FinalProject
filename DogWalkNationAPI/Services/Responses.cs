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


            //[JsonProperty(Order = -3)]
            //public bool Success { get; set; }
            //[JsonProperty(Order = -2)]
            //public string Message { get; set; }
            //[JsonIgnore]
            //[System.Text.Json.Serialization.JsonIgnore]
            //public HttpStatusCode StatusCode { get; set; }
        }
    }
}
