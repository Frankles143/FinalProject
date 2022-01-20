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

        [HttpGet]
        [Route("/[controller]/allWalks")]
        public async Task<IActionResult> GetAllWalks()
        {
            var query = new QueryDefinition("SELECT * FROM c");
            return Ok(await _walkHelper.GetMultiple(query));
        }

        [HttpGet]
        [Route("/[controller]/{id}")]
        public async Task<IActionResult> GetWalk(Guid id)
        {
            return Ok(await _walkHelper.Get(id, id.ToString()));
        }

        [HttpPost]
        [Route("/[controller]/newWalk")]
        public async Task<Responses.Default> CreateNewRoute(NewWalk walk)
        {
            Guid walkId = Guid.NewGuid();

            //Create walk object
            Walk newWalk = new(walkId, walk.WalkName, walk.WalkCoords);

            try
            {
                await _walkHelper.Update(walkId.ToString(), newWalk);

                return new Responses.Default() { Success = true, Message = "Walk created" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }

        }

        [HttpPut]
        [Route("/[controller]/updateWalk")]
        public async Task<Responses.Default> UpdateWalk(Walk walk)
        {
            try
            {
                await _walkHelper.Update(walk.WalkId.ToString(), walk);

                return new Responses.Default() { Success = true, Message = "Walk updated!" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }
        }

    }
}
