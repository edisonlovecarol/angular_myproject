using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Wu.MyProject.Authorization.Dto;
using Wu.MyProject.Authorization.Roles.Dto;
using Wu.MyProject.Utility.Extensions;
using Wu.MyProject.Utility.Query;

namespace Wu.MyProject.Authorization.Roles
{
    public class RoleAppService : MyProjectAppServiceBase, IRoleAppService
    {
        private readonly RoleManager _roleManager;

        public RoleAppService(RoleManager roleManager)
        {
            _roleManager = roleManager;
        }
        /// <summary>
        /// 获取所有角色信息
        /// </summary>
        /// <returns></returns>
        public  PagedResultOutput<RoleListDto> GetRoles(FilterGroup filter)
        {
            Stopwatch sw = new Stopwatch();

            sw.Start();
            QueryModel model = new QueryModel(filter);

            int total;
            var data =  GetQueryData<Role, int>(_roleManager.Roles, model)
                .Where<Role>(model.PageIndex, model.PageSize, out total, model.PageCondition.SortConditions);
            var userListDtos =  data.MapTo<List<RoleListDto>>();

            var result = new PagedResultOutput<RoleListDto>(total, userListDtos);
            sw.Stop();

            Console.WriteLine(sw.Elapsed);

            return result;
        }

        public async Task<GetRoleForEditOutput> GetRoleForEdit(NullableIdInput input)
        {
            var permissions = PermissionManager.GetAllPermissions();
            var grantedPermissions = new Permission[0];
            RoleEditDto roleEditDto;
            if (input.Id.HasValue) //Editing existing role?
            {
                var role = await _roleManager.GetRoleByIdAsync(input.Id.Value);
                grantedPermissions = (await _roleManager.GetGrantedPermissionsAsync(role)).ToArray();
                roleEditDto = role.MapTo<RoleEditDto>();
            }else
            {
                roleEditDto = new RoleEditDto();
            }
            return new GetRoleForEditOutput
            {
                Role = roleEditDto,
                Permissions = permissions.MapTo<List<FlatPermissionDto>>().OrderBy(p => p.DisplayName).ToList(),
                GrantedPermissionNames = grantedPermissions.Select(p => p.Name).ToList()
            };




            
        }

        public async Task CreateOrUpdateRole(CreateOrUpdateRoleInput input)
        {
            if (input.Role.Id.HasValue)
            {
                await UpdateRoleAsync(input);
            }
            else
            {
                await CreateRoleAsync(input);
            }
        }

        private async Task UpdateRoleAsync(CreateOrUpdateRoleInput input)
        {
            Debug.Assert(input.Role.Id != null, "input.Role.Id should be set.");
            var role = await _roleManager.GetRoleByIdAsync(input.Role.Id.Value);
            role.DisplayName = input.Role.DisplayName;
            role.IsDefault = input.Role.IsDefault;
            await UpdateGrantedPermissionsAsync(role, input.GrantedPermissionNames);
        }

        private async Task CreateRoleAsync(CreateOrUpdateRoleInput input)
        {
            var role = new Role(AbpSession.TenantId, input.Role.DisplayName) { IsDefault = input.Role.IsDefault };
            CheckErrors(await _roleManager.CreateAsync(role));
            await CurrentUnitOfWork.SaveChangesAsync(); //It's done to get Id of the role.
            await UpdateGrantedPermissionsAsync(role, input.GrantedPermissionNames);
        }

        private async Task UpdateGrantedPermissionsAsync(Role role, List<string> grantedPermissionNames)
        {
            var grantedPermissions = PermissionManager.GetPermissionsFromNamesByValidating(grantedPermissionNames);
            await _roleManager.SetGrantedPermissionsAsync(role, grantedPermissions);
        }

        public async Task DeleteRole(EntityRequestInput input)
        {
            var role = await _roleManager.GetRoleByIdAsync(input.Id);
            CheckErrors(await _roleManager.DeleteAsync(role));
        }
    }
}
