using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class Comment
    {
        [JsonConstructor]
        public Comment(Guid commentId, Guid userId, string username, DateTime timestamp, string commentBody)
        {
            CommentId = commentId;
            UserId = userId;
            Username = username;
            Timestamp = timestamp;
            CommentBody = commentBody;
        }

        public static string ContainerName = "Comment";

        [JsonProperty(PropertyName = "id")]
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public DateTime Timestamp { get; set; }
        public string CommentBody { get; set; }
    }

    public class CommentIds
    {
        [JsonProperty(PropertyName = "ids")]
        public List<Guid> Ids { get; set; }
    }
}
