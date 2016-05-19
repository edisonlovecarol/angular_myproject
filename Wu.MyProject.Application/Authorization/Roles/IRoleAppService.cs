using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Wu.MyProject.Authorization.Roles.Dto;
using Wu.MyProject.Utility.Query;

namespace Wu.MyProject.Authorization.Roles
{
    public interface IRoleAppService : IApplicationService
    {
        PagedResultOutput<RoleListDto> GetRoles(FilterGroup filter);

        Task<GetRoleForEditOutput> GetRoleForEdit(NullableIdInput input);

        Task CreateOrUpdateRole(CreateOrUpdateRoleInput input);

        Task DeleteRole(EntityRequestInput input);
    }
}
