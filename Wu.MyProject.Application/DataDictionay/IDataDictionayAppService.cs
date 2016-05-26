using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Wu.MyProject.DataDictionay.Dto;
using Wu.MyProject.Organizations.Dto;

namespace Wu.MyProject.DataDictionay
{


    public interface IDataDictionayAppService : IApplicationService
    {
        Task<ListResultOutput<DataDictionayDto>> GetDataDictionry();



        Task<DataDictionayDto> CreateDataDictionry(CreateDataDictionryInput input);

        Task<DataDictionayDto> UpdateDataDictionry(UpdateDataDictionryInput input);

        Task<DataDictionayDto> MoveDataDictionry(MoveDataDictionryInput input);

        Task DeleteDataDictionry(IdInput<long> input);
    }
}