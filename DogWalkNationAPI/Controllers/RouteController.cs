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

        [HttpGet]
        [Route("/[controller]/allRoutes")]
        public async Task<IActionResult> GetAllRoutes()
        {
            //This will become all routes for a specific walk
            var query = new QueryDefinition("SELECT * FROM c");
            return Ok(await _routeHelper.GetMultiple(query));
        }

        [HttpGet]
        [Route("/[controller]/{id}/{key}")]
        public async Task<IActionResult> GetUser(Guid id, string key)
        {
            return Ok(await _routeHelper.Get(id, key));
        }

        [HttpPost]
        [Route("/[controller]/newRoute")]
        public async Task<Responses.Default> CreateNewRoute(List<List<double>> coords)
        {
            Guid routeId = Guid.NewGuid();

            //Create route object
            Route newRoute = new(routeId, coords);

            try
            {
                await _routeHelper.Update(routeId.ToString(), newRoute);

                return new Responses.Default() { Success = true, Message = "Route created" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }
            
        }
    }
}
