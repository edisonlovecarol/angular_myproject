using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Wu.MyProject.DataDictionay.Dto;

namespace Wu.MyProject.DataDictionay
{
    public class DataDictionayAppService:MyProjectAppServiceBase,IDataDictionayAppService
    {
        private readonly IRepository<DataDictionay, long> _dataDictionayUnitRepository;
        private readonly DataDictionayManager _dataDictionayManager;

        public DataDictionayAppService(IRepository<DataDictionay, long> dataDictionayUnitRepository,
                    DataDictionayManager dataDictionayManager
            )
        {
            this._dataDictionayUnitRepository = dataDictionayUnitRepository;
            _dataDictionayManager = dataDictionayManager;
        }
        public async Task<ListResultOutput<DataDictionayDto>> GetDataDictionry()
        {
            var query = _dataDictionayUnitRepository.GetAll();
            var items = await query.ToListAsync();
            //第一种方式
            return new ListResultOutput<DataDictionayDto>(
                items.Select(item =>
                {
                    var dto = item.MapTo<DataDictionayDto>();
                    return dto;
                }).ToList()
                );
            //第二种方式
            //return new ListResultOutput<DataDictionayDto>(
            //    items.MapTo<List<DataDictionayDto>>()
            //   );
        }

        public async Task<DataDictionayDto> CreateDataDictionry(CreateDataDictionryInput input)
        {
            var dataDictionay = new DataDictionay(AbpSession.TenantId, input.DisplayName, input.ParentId);

            await _dataDictionayManager.CreateAsync(dataDictionay);
            await CurrentUnitOfWork.SaveChangesAsync();

            return dataDictionay.MapTo<DataDictionayDto>();
        }

        public async Task<DataDictionayDto> UpdateDataDictionry(UpdateDataDictionryInput input)
        {
            var dataDictionay = await _dataDictionayUnitRepository.GetAsync(input.Id);

            dataDictionay.DisplayName = input.DisplayName;

            await _dataDictionayManager.UpdateAsync(dataDictionay);

            return  dataDictionay.MapTo<DataDictionayDto>();
        }

        public async Task<DataDictionayDto> MoveDataDictionry(MoveDataDictionryInput input)
        {
            await _dataDictionayManager.MoveAsync(input.Id, input.NewParentId);

            return   _dataDictionayUnitRepository.GetAsync(input.Id).MapTo<DataDictionayDto>();
        }

        public async Task DeleteDataDictionry(IdInput<long> input)
        {
            await _dataDictionayManager.DeleteAsync(input.Id);
        }
    }
}
