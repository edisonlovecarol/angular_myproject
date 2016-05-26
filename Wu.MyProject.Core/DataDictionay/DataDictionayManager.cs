using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Domain.Uow;
using Abp.UI;

namespace Wu.MyProject.DataDictionay
{
    /// <summary>
    /// 数据字典领域逻辑
    /// </summary>
    public class DataDictionayManager:DomainService
    {
        protected IRepository<DataDictionay, long> DataDictionayRepository { get; private set; }

        public DataDictionayManager(IRepository<DataDictionay, long> dataDictionayRepository)
        {
            DataDictionayRepository = dataDictionayRepository;
        }
        [UnitOfWork]
        public virtual async Task CreateAsync(DataDictionay dataDictionay)
        {
            dataDictionay.Code = await GetNextChildCodeAsync(dataDictionay.ParentId);
            await ValidateDataDictionayAsync(dataDictionay);
            await DataDictionayRepository.InsertAsync(dataDictionay);
        }
        [UnitOfWork]
        public virtual async Task DeleteAsync(long id)
        {

            var children = await FindChildrenAsync(id);
            foreach (var child in children)
            {
                await DataDictionayRepository.DeleteAsync(child);
            }
            await DataDictionayRepository.DeleteAsync(id);
        }
        [UnitOfWork]
        public virtual async Task MoveAsync(long id, long? parentId)
        {
            var dataDictionay = await DataDictionayRepository.GetAsync(id);
            if (dataDictionay.ParentId==parentId)
            {
                return;
            }
            var children = await FindChildrenAsync(id);
            var oldCode = dataDictionay.Code;

            dataDictionay.Code = await GetNextChildCodeAsync(parentId);
            dataDictionay.ParentId = parentId;
            await ValidateDataDictionayAsync(dataDictionay);
            //更新
            foreach (var child in children)
            {
                child.Code = DataDictionay.AppendCode(dataDictionay.Code,
                    DataDictionay.GetRelativeCode(child.Code, oldCode));
            }

        }

        public virtual async Task UpdateAsync(DataDictionay dataDictionay)
        {
            await ValidateDataDictionayAsync(dataDictionay);
            await DataDictionayRepository.UpdateAsync(dataDictionay);
        }

        public async Task<List<DataDictionay>> FindChildrenAsync(long? parentId)
        {
            return await DataDictionayRepository.GetAllListAsync(ou => ou.ParentId == parentId);
        }
        /// <summary>
        /// 验证数据字典的合法性
        /// </summary>
        /// <param name="dataDictionay"></param>
        /// <returns></returns>
        protected virtual async Task ValidateDataDictionayAsync(DataDictionay dataDictionay)
        {
            var query = (await FindChildrenAsync(dataDictionay.ParentId))
                .Where(ou => ou.Id != dataDictionay.Id)
                .ToList();
            if (query.Any(ou=>ou.DisplayName==dataDictionay.DisplayName))
            {
                throw new UserFriendlyException(L("OrganizationUnitDuplicateDisplayNameWarning", dataDictionay.DisplayName));
            }



        }

      

        public virtual async Task<string> GetNextChildCodeAsync(long? parentId)
        {
            var lastChild = await GetLastChildOrNullAsync(parentId);
            if (lastChild == null)
            {
                var parentCode = parentId != null ? await GetCodeAsync(parentId.Value) : null;
                return DataDictionay.AppendCode(parentCode, DataDictionay.CreateCode(1));
            }

            return DataDictionay.CalculateNextCode(lastChild.Code);
        }

        public virtual async Task<DataDictionay> GetLastChildOrNullAsync(long? parentId)
        {
            var children = await DataDictionayRepository.GetAllListAsync(ou => ou.ParentId == parentId);
            return children.OrderBy(c => c.Code).LastOrDefault();
        }

        public virtual async Task<string> GetCodeAsync(long id)
        {
            return (await DataDictionayRepository.GetAsync(id)).Code;
        }
    }
}
