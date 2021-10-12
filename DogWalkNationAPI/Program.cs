using System;
using System.Threading.Tasks;
using System.Configuration;
using System.Collections.Generic;
using System.Net;
using Microsoft.Azure.Cosmos;

namespace DogWalkNationAPI
{
    class Program
    {
        //cosmos endpoint
        private static readonly string EndpointUri = "https://dogwalknation.documents.azure.com:443/";
        //primary key for cosmos
        private static readonly string PrimaryKey = "fLkuoHqOIBEvNe2hwnV4DNDZQgFvEDqi9zVCGKoQWHy5gt9r2wdPuEQ5pKNNsLKybLxSqKoDY2OV46xCcWcSrg==";

        private CosmosClient cosmosClient;
        private Database database;
        private Container container;

        // The name of the database and container we will create
        private string databaseId = "DogWalkNation";
        private string containerId = "Users";

        public static async Task Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            try
            {
                Console.WriteLine("Beginning operations...\n");
                Program p = new Program();
                await p.GetStarted();

            }
            catch (CosmosException de)
            {
                Exception baseException = de.GetBaseException();
                Console.WriteLine("{0} error occurred: {1}", de.StatusCode, de);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error: {0}", e);
            }
            finally
            {
                Console.WriteLine("End of demo, press any key to exit.");
                Console.ReadKey();
            }

        }

        public async Task GetStarted()
        {
            // Create a new instance of the Cosmos Client
            this.cosmosClient = new CosmosClient(EndpointUri, PrimaryKey);

            await this.CreateDatabaseAsync();
            await this.CreateContainerAsync();
        }

        /// <summary>
        /// Checks for a database, if none exists, create one
        /// </summary>
        private async Task CreateDatabaseAsync()
        {
            // Create a new database
            this.database = await this.cosmosClient.CreateDatabaseIfNotExistsAsync(databaseId);
            Console.WriteLine("Created Database: {0}\n", this.database.Id);
        }

        /// <summary>
        /// Create the container if it does not exist. 
        /// </summary>
        private async Task CreateContainerAsync()
        {
            // Create a new container
            this.container = await this.database.CreateContainerIfNotExistsAsync(containerId, "/userId");
            Console.WriteLine("Created Container: {0}\n", this.container.Id);
        }
    }
}
