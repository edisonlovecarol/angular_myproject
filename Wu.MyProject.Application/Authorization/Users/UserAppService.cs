using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Abp.Extensions;
using Castle.Core.Internal;
using Microsoft.AspNet.Identity;
using Wu.MyProject.Authorization.Dto;
using Wu.MyProject.Authorization.Roles;
using Wu.MyProject.Authorization.Users.Dto;
using Wu.MyProject.Authorization.Users.Exporting;
using Wu.MyProject.Dto;
using Wu.MyProject.Users;
using Wu.MyProject.Utility.Extensions;
using Wu.MyProject.Utility.Query;

namespace Wu.MyProject.Authorization.Users
{
    public class UserAppService : MyProjectAppServiceBase,IUserAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IUserListExcelExporter _userListExcelExporter;
        //private readonly IUserListExcelExporter _userListExcelExporter;
        public UserAppService(
         RoleManager roleManager,
            IUserListExcelExporter userListExcelExporter)
        {
            _roleManager = roleManager;
            _userListExcelExporter = userListExcelExporter;
        }
        
        /// <summary>
        /// 获取用户信息集合
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public async Task<PagedResultOutput<UserListDto>> GetUsers(FilterGroup filter)
        {
            QueryModel model = new QueryModel(filter);

            int total;
            var data = GetQueryData<User,long>(UserManager.Users, model)
                .Where<User>(model.PageIndex, model.PageSize, out total, model.PageCondition.SortConditions);
            var userListDtos = data.MapTo<List<UserListDto>>();
            await FillRoleNames(userListDtos);
            return new PagedResultOutput<UserListDto>(total,userListDtos);
        }
        //文件导出
        public async Task<FileDto> GetUsersToExcel()
        {
            var users = await UserManager.Users.Include(u => u.Roles).ToListAsync();
            var userListDtos = users.MapTo<List<UserListDto>>();
            await FillRoleNames(userListDtos);

            return _userListExcelExporter.ExportToFile(userListDtos);
        }


        public async Task<GetUserForEditOutput> GetUserForEdit(NullableIdInput<long> input)
        {
            //Getting all available roles
            var userRoleDtos = (await _roleManager.Roles
                .OrderBy(r => r.DisplayName)
                .Select(r => new UserRoleDto
                {
                    RoleId = r.Id,
                    RoleName = r.Name,
                    RoleDisplayName = r.DisplayName
                })
                .ToArrayAsync());

            var output = new GetUserForEditOutput
            {
                Roles = userRoleDtos
            };
            if (!input.Id.HasValue)
            {
                //新增一名用户
                output.User = new UserEditDto {IsActive = true, ShouldChangePasswordOnNextLogin = true};
                foreach (var defaultRole in await _roleManager.Roles.Where(r=>r.IsDefault).ToListAsync())
                {
                    var defaultUserRole = userRoleDtos.FirstOrDefault(ur => ur.RoleName == defaultRole.Name);
                    if (defaultUserRole!=null)
                    {
                        defaultUserRole.IsAssigned = true;
                    }
                }
            }
            else
            {
                //修改一名用户
                var user = await UserManager.GetUserByIdAsync(input.Id.Value);
                output.User = user.MapTo<UserEditDto>();

                foreach (var userRoleDto in userRoleDtos)
                {
                    userRoleDto.IsAssigned = await UserManager.IsInRoleAsync(input.Id.Value, userRoleDto.RoleName);
                }

            }
            return output;
        }
        /// <summary>
        /// 获取用户权限
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<GetUserPermissionsForEditOutput> GetUserPermissionsForEdit(IdInput<long> input)
        {
            var user = await UserManager.GetUserByIdAsync(input.Id);
            var permissions = PermissionManager.GetAllPermissions();
            var grantedPermissions = await UserManager.GetGrantedPermissionsAsync(user);
            return new GetUserPermissionsForEditOutput
            {
                Permissions = permissions.MapTo<List<FlatPermissionDto>>().OrderBy(p=>p.DisplayName).ToList(),
                GrantedPermissionNames = grantedPermissions.Select(p=>p.Name).ToList()
                
            };
        }

        public Task ResetUserSpecificPermissions(IdInput<long> input)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// 更新用户权限
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task UpdateUserPermissions(UpdateUserPermissionsInput input)
        {
            var user = await UserManager.GetUserByIdAsync(input.Id);
            var grantedPermissions = PermissionManager.GetPermissionsFromNamesByValidating(input.GrantedPermissionNames);
            await UserManager.SetGrantedPermissionsAsync(user, grantedPermissions);
        }

        public async Task CreateOrUpdateUser(CreateOrUpdateUserInput input)
        {
            if (input.User.Id.HasValue)
            {
                await UpdateUserAsync(input);
            }
            else
            {
                await CreateUserAsync(input);
            }
        }

        private async Task UpdateUserAsync(CreateOrUpdateUserInput input)
        {
            Debug.Assert(input.User.Id != null, "input.User.Id should be set.");
            var user = await UserManager.FindByIdAsync(input.User.Id.Value);
            //更新用户属性
            input.User.MapTo(user);//密码不会被映射
            if (input.User.Password.IsNullOrEmpty())
            {
                CheckErrors(await UserManager.ChangePasswordAsync(user, input.User.Password));
            }
            CheckErrors(await UserManager.UpdateAsync(user));
            //更新角色
            CheckErrors(await UserManager.SetRoles(user, input.AssignedRoleNames));
            //发送邮件通知
            if (input.SendActivationEmail)
            {
                user.SetNewEmailConfirmationCode();
               // await _userEmailer.SendEmailActivationLinkAsync(user, input.User.Password);
            }
        }
        [AbpAuthorize(PermissionNames.Pages_Administration_Users_Create)]
        protected virtual async Task CreateUserAsync(CreateOrUpdateUserInput input)
        {
            var user = input.User.MapTo<User>();
            if (!input.User.Password.IsNullOrEmpty())
            {
                CheckErrors(await UserManager.PasswordValidator.ValidateAsync(input.User.Password));
            }
            else
            {
                input.User.Password = User.CreateRandomPassword();
            }
            user.Password = new PasswordHasher().HashPassword(input.User.Password);
            user.ShouldChangePasswordOnNextLogin = input.User.ShouldChangePasswordOnNextLogin;

            user.Roles = new Collection<UserRole>();
            foreach (var roleName in input.AssignedRoleNames)
            {
                var role = await _roleManager.GetRoleByNameAsync(roleName);
                user.Roles.Add(new UserRole{RoleId = role.Id});
            }
            CheckErrors(await UserManager.CreateAsync(user));
            await CurrentUnitOfWork.SaveChangesAsync(); //To get new user's Id.

        }

        public async Task DeleteUser(IdInput<long> input)
        {
            var user = await UserManager.GetUserByIdAsync(input.Id);
            CheckErrors(await UserManager.DeleteAsync(user));

            //throw new NotImplementedException();
        }

        private async Task FillRoleNames(List<UserListDto> userListDtos)
        {
            /* This method is optimized to fill role names to given list. */

            var distinctRoleIds = (
                from userListDto in userListDtos
                from userListRoleDto in userListDto.Roles
                select userListRoleDto.RoleId
                ).Distinct();

            var roleNames = new Dictionary<int, string>();
            foreach (var roleId in distinctRoleIds)
            {
                roleNames[roleId] = (await _roleManager.GetRoleByIdAsync(roleId)).DisplayName;
            }

            foreach (var userListDto in userListDtos)
            {
                foreach (var userListRoleDto in userListDto.Roles)
                {
                    userListRoleDto.RoleName = roleNames[userListRoleDto.RoleId];
                }

                userListDto.Roles = userListDto.Roles.OrderBy(r => r.RoleName).ToList();
            }
        }
    }
}
