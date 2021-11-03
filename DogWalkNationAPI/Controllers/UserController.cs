using DogWalkNationAPI.Models;
using DogWalkNationAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Controllers
{ 
    //Get mapper

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly ICosmosService<Models.User> _userHelper;

        public UserController(CosmosClient dbClient)
        {
            _userHelper = new CosmosService<Models.User>(dbClient, Models.User.ContainerName);
        }

        [HttpGet]
        [Route("/allUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await _userHelper.GetMultiple("SELECT * FROM c"));
        }

        [HttpGet]
        [Route("/user/{id}/{key}")]
        public async Task<IActionResult> GetUser(string id, string key)
        {
            return Ok(await _userHelper.Get(id, key));
        }
    }
}
