using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Validation;

namespace Wu.MyProject.Authorization
{
   
    public static class PermissionManagerExtensions
    {
        /// <summary>
        /// 根据权限名获取所有权限
        /// </summary>
        public static IEnumerable<Permission> GetPermissionsFromNamesByValidating(
            this IPermissionManager permissionManager, IEnumerable<string> permissionNames)
        {
            var permissions = new List<Permission>();
            var undefinedPermissionNames = new List<string>();

            foreach (var permissionName in permissionNames)
            {
                var permission = permissionManager.GetPermissionOrNull(permissionName);
                if (permission == null)
                {
                    undefinedPermissionNames.Add(permissionName);
                }

                permissions.Add(permission);
            }

            if (undefinedPermissionNames.Count > 0)
            {
                throw new AbpValidationException(string.Format("There are {0} undefined permission names.", undefinedPermissionNames.Count))
                {
                    ValidationErrors = undefinedPermissionNames.ConvertAll(permissionName => new ValidationResult("Undefined permission: " + permissionName))
                };
            }

            return permissions;
        }
    }
}
