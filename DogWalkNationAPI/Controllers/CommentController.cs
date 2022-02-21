using DogWalkNationAPI.Helpers;
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

        [HttpPost]
        [Route("/[controller]/getComments")]
        public async Task<Responses.DefaultWithComments> GetComments(CommentIds ids)
        {
            List<Comment> comments = new();

            try
            {
                //Go through all the ids in the list in the CommentIds object and return the comments
                for (int i = 0; i < ids.Ids.Count; i++)
                {
                    comments.Add(await _commentHelper.Get(ids.Ids[i], ids.Ids[i].ToString()));
                }

                return new Responses.DefaultWithComments() { Success = true, Message = "Comments found", Comments = comments };
            }
            catch (Exception)
            {
                return new Responses.DefaultWithComments() { Success = false, Message = "An error has occurred", Comments = null };
                throw;
            }

        }

        [HttpGet]
        [Route("/[controller]/{id}")]
        public async Task<IActionResult> GetComment(Guid id)
        {
            return Ok(await _commentHelper.Get(id, id.ToString()));
        }

        [HttpPost]
        [Route("/[controller]/newComment")]
        public async Task<Responses.Default> CreateNewComment(Comment newComment)
        {
            try
            {
                await _commentHelper.Add(newComment.CommentId.ToString(), newComment);

                return new Responses.Default() { Success = true, Message = "Comment created" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }

        }

        [HttpPut]
        [Route("/[controller]/updateComment")]
        public async Task<Responses.Default> UpdateComment(Comment comment)
        {
            try
            {
                await _commentHelper.Update(comment.CommentId.ToString(), comment);

                return new Responses.Default() { Success = true, Message = "Comment updated!" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }
        }

        [TokenAuthorize]
        [HttpDelete]
        [Route("/[controller]/deleteComment")]
        public async Task<Responses.Default> DeleteComment(Guid commentId)
        {
            try
            {
                await _commentHelper.Delete(commentId, commentId.ToString());

                return new Responses.Default() { Success = true, Message = "Comment deleted!" };
            }
            catch (Exception)
            {
                return new Responses.Default() { Success = false, Message = "An error has occurred" };
                throw;
            }
        }
    }
}
