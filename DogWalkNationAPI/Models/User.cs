using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Models
{
    public class User
    {
        public User()
        {

        }

        public static string ContainerName = "User";

        [JsonProperty(PropertyName = "id")]
        public Guid UserId { get; set; }
        [JsonProperty(PropertyName = "username")]
        public string Username { get; set; }
        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; }
        [JsonProperty(PropertyName = "firstName")]
        public string FirstName { get; set; }
        [JsonProperty(PropertyName = "lastName")]
        public string LastName { get; set; }
        [JsonProperty(PropertyName = "salt")]
        public byte[] Salt { get; set; }
        [JsonProperty(PropertyName = "hashedPassword")]
        public string HashedPassword { get; set; }
        [JsonProperty(PropertyName = "createdWalks")]
        public List<string> CreatedWalks { get; set; }
        [JsonProperty(PropertyName = "favouriteWalks")]
        public List<string> FavouriteWalks { get; set; }
        [JsonProperty(PropertyName = "dateRegistered")]
        public DateTime DateRegistered { get; set; }
    }

    public class UserLogin
    {
        [JsonProperty(PropertyName = "email")]
        [EmailAddress]
        public string Email { get; set; }
        [JsonProperty(PropertyName = "password")]
        public string Password { get; set; }

    }
}
