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
    public class RouteController : Controller
    {
        private readonly ICosmosService<Route> _routeHelper;

        public RouteController(CosmosClient dbClient)
        {
            _routeHelper = new CosmosService<Route>(dbClient, Route.ContainerName);
        }
        

    }
}
