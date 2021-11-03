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
    public class CommentController : Controller
    {
        private readonly ICosmosService<Comment> _commentHelper;

        public CommentController(CosmosClient dbClient)
        {
            _commentHelper = new CosmosService<Comment>(dbClient, Comment.ContainerName);
        }
    }
}
