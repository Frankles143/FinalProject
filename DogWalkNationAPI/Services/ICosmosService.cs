using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;

namespace DogWalkNationAPI.Services
{
    public interface ICosmosService<T>
    {       
        Task Add(string key, T item);
        Task Delete(string id, string key);
        Task<T> Get(string id, string key);
        Task<IEnumerable<T>> GetMultiple(string query);
        Task Update(string key, T item);
    }
}
