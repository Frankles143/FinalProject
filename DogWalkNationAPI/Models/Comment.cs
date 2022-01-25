using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class Comment
    {
        public static string ContainerName = "Comment";

        [JsonProperty(PropertyName = "id")]
        public Guid CommentId { get; set; }
        public string UserId { get; set; }
        public DateTime Timestamp { get; set; }
        public string CommentBody { get; set; }
    }
}
