using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Wu.MyProject.Authorization.Roles;
using Wu.MyProject.Authorization.Users.Dto;
using Wu.MyProject.Users;
using Wu.MyProject.Utility.Extensions;
using Wu.MyProject.Utility.Query;

namespace Wu.MyProject.Authorization.Users
{
    public class UserAppService : MyProjectAppServiceBase,IUserAppService
    {
        private readonly RoleManager _roleManager;
        //private readonly IUserListExcelExporter _userListExcelExporter;
        public UserAppService(
         RoleManager roleManager)
        {
            _roleManager = roleManager;
         
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

            return new PagedResultOutput<UserListDto>(total,data.MapTo<List<UserListDto>>());
        }

        public Task<GetUserForEditOutput> GetUserForEdit(NullableIdInput<long> input)
        {
            throw new NotImplementedException();
        }

        public Task<GetUserPermissionsForEditOutput> GetUserPermissionsForEdit(IdInput<long> input)
        {
            throw new NotImplementedException();
        }

        public Task ResetUserSpecificPermissions(IdInput<long> input)
        {
            throw new NotImplementedException();
        }

        public Task UpdateUserPermissions(UpdateUserPermissionsInput input)
        {
            throw new NotImplementedException();
        }

        public Task CreateOrUpdateUser(CreateOrUpdateUserInput input)
        {
            throw new NotImplementedException();
        }

        public Task DeleteUser(IdInput<long> input)
        {
            throw new NotImplementedException();
        }
    }
}
