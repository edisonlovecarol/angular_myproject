using System.Threading.Tasks;
using Abp.Application.Services;
using Wu.MyProject.Users.Dto;

namespace Wu.MyProject.Users
{
    public interface IUserAppService : IApplicationService
    {
        Task ProhibitPermission(ProhibitPermissionInput input);

        Task RemoveFromRole(long userId, string roleName);
    }
}