using Abp.Domain.Repositories;
using Abp.MultiTenancy;
using Wu.MyProject.Authorization.Roles;
using Wu.MyProject.Editions;
using Wu.MyProject.Users;

namespace Wu.MyProject.MultiTenancy
{
    public class TenantManager : AbpTenantManager<Tenant, Role, User>
    {
        public TenantManager(
            IRepository<Tenant> tenantRepository, 
            IRepository<TenantFeatureSetting, long> tenantFeatureRepository, 
            EditionManager editionManager) 
            : base(
                tenantRepository, 
                tenantFeatureRepository, 
                editionManager
            )
        {
        }
    }
}