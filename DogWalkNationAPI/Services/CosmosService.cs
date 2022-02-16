using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Services
{
    public class CosmosService<T> : ICosmosService<T>
    {
        private Container _container;

        /// <summary>
        /// Create the service, passing in the db and container name
        /// </summary>
        /// <param name="db"></param>
        /// <param name="containerName"></param>
        public CosmosService(CosmosClient db, string containerName)
        {
            string database = ConfigurationManager.AppSettings["CosmosDB"];

            if(database == null)
            {
                database = "DogWalkNation";
            }

            _container = db.GetContainer(database, containerName);
        }

        /// <summary>
        /// Add something to a container
        /// </summary>
        /// <param name="key"></param>
        /// <param name="item"></param>
        /// <returns></returns>
        public async Task Add(string key, T item)
        {
            await _container.CreateItemAsync(item, new PartitionKey(key));
        }

        /// <summary>
        /// Delete something from a container
        /// </summary>
        /// <param name="id"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public async Task Delete(Guid id, string key)
        {
            await _container.DeleteItemAsync<T>(id.ToString(), new PartitionKey(key));
        }

        /// <summary>
        /// Get an item from a container
        /// </summary>
        /// <param name="id"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public async Task<T> Get(Guid id, string key)
        {
            try
            {
                var response = await _container.ReadItemAsync<T>(id.ToString(), new PartitionKey(key));
                return response.Resource;
            }
            catch (CosmosException)
            {
                return default;
            }
        }

        /// <summary>
        /// Get multiple items from a container using a query
        /// </summary>
        /// <param name="queryString"></param>
        /// <returns>A list of any type item</returns>
        public async Task<IEnumerable<T>> GetMultiple(QueryDefinition queryString)
        {
            var query = _container.GetItemQueryIterator<T>(queryString);

            var results = new List<T>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }

            return results;
        }

        /// <summary>
        /// Updates an entire item
        /// </summary>
        /// <param name="key"></param>
        /// <param name="item"></param>
        /// <returns></returns>
        public async Task Update(string key, T item)
        {
            await _container.UpsertItemAsync(item, new PartitionKey(key));
        }

        /// <summary>
        /// Replaces an item
        /// </summary>
        /// <param name="key"></param>
        /// <param name="item"></param>
        /// <returns></returns>
        public async Task Replace(string key, T item)
        {
            await _container.ReplaceItemAsync(item, key, new PartitionKey(key));


        }
    }
}
