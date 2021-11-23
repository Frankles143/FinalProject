using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DogWalkNationAPI.Services;
using DogWalkNationAPI.Models;
using Microsoft.Azure.Cosmos;

namespace DogWalkNationAPI.Helpers
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AppSettings _appSettings;
        private readonly ICosmosService<Models.User> _userHelper;

        public JwtMiddleware(CosmosClient dbClient, RequestDelegate next, IOptions<AppSettings> appSettings)
        {
            _userHelper = new CosmosService<Models.User>(dbClient, Models.User.ContainerName);
            _next = next;
            _appSettings = appSettings.Value;

        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
                await attachUserToContext(context, token);

            await _next(context);
        }

        private async Task attachUserToContext(HttpContext context, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = Guid.Parse(jwtToken.Claims.First(x => x.Type == "userId").Value);
                var username = jwtToken.Claims.First(x => x.Type == "username").Value;

                Models.User user = await _userHelper.Get(userId, username);

                // attach user to context on successful jwt validation
                context.Items["User"] = user;
            }
            catch
            {
                // do nothing if jwt validation fails
                // user is not attached to context so request won't have access to secure routes
            }
        }
    }
}
