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

        [HttpPost]
        [Route("/[controller]/getRoutes")]
        public async Task<Responses.DefaultWithRoutes> GetRoutes(RouteIds ids)
        {
            List<Route> routes = new();

            try
            {
                //Go through all the ids in the list in the RouteIds object and return the routes
                for (int i = 0; i < ids.Ids.Count; i++)
                {
                    routes.Add(await _routeHelper.Get(ids.Ids[i], ids.Ids[i].ToString()));
                }

                return new Responses.DefaultWithRoutes() { Success = true, Message = "Routes found", Routes = routes };
            }
            catch (Exception)
            {
                return new Responses.DefaultWithRoutes() { Success = false, Message = "An error has occurred", Routes = null };
                throw;
            }
            
        }

        [HttpGet]
        [Route("/[controller]/{id}")]
        public async Task<IActionResult> GetRoute(Guid id)
        {
            return Ok(await _routeHelper.Get(id, id.ToString()));
        }

        [HttpPost]
        [Route("/[controller]/newEmptyRoute")]
        public async Task<Responses.Default> CreateNewEmptyRoute(List<List<double>> coords)
        {
            Guid routeId = Guid.NewGuid();

            //Create route object
            Route newRoute = new(routeId, coords);

            try
            {
                await _routeHelper.Add(routeId.ToString(), newRoute);

                return new Responses.Default() { Success = true, Message = "Route created" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }
            
        }

        [HttpPost]
        [Route("/[controller]/newRoute")]
        public async Task<Responses.Default> CreateNewRoute(Route newRoute)
        {
            try
            {
                await _routeHelper.Add(newRoute.RouteId.ToString(), newRoute);

                return new Responses.Default() { Success = true, Message = "Route created" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }

        }

        [HttpPut]
        [Route("/[controller]/updateRoute")]
        public async Task<Responses.Default> UpdateRoute(Route route)
        {
            try
            {
                await _routeHelper.Update(route.RouteId.ToString(), route);

                return new Responses.Default() { Success = true, Message = "Route updated!" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }
        }
    }
}
