using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Wu.MyProject.Authorization.Dto;

namespace Wu.MyProject.Authorization.Roles.Dto
{
    public class GetRoleForEditOutput : IOutputDto
    {
        public RoleEditDto Role { get; set; }

        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}