﻿using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Wu.MyProject.Authorization.Dto;

namespace Wu.MyProject.Authorization.Users.Dto
{
    public class GetUserPermissionsForEditOutput : IOutputDto
    {
        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}