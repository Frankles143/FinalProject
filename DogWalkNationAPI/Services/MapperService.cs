using AutoMapper;
using DogWalkNationAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DogWalkNationAPI.Services
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //USER
            CreateMap<UserChangePassword, User>();
        }
    }
}
