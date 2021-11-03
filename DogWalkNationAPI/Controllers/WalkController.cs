using DogWalkNationAPI.Models;
using DogWalkNationAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WalkController : Controller
    {
        private readonly ICosmosService<Walk> _walkHelper;

        public WalkController(CosmosClient dbClient)
        {
            _walkHelper = new CosmosService<Walk>(dbClient, Walk.ContainerName);
        }


    }
}
