using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class User
    {
        public static string ContainerName = "User";

        [JsonProperty(PropertyName = "id")]
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public byte[] Salt { get; set; }
        public string HashedPassword { get; set; }
        public List<string> CreatedWalks { get; set; }
        public List<string> FavouriteWalks { get; set; }
    }
}
