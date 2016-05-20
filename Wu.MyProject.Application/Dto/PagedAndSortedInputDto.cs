using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace Wu.MyProject.Dto
{
    public class PagedAndSortedInputDto : IInputDto, IPagedResultRequest, ISortedResultRequest
    {
        [Range(1, AppConsts.MaxPageSize)]
        public int MaxResultCount { get; set; }

        [Range(0, int.MaxValue)]
        public int SkipCount { get; set; }

        public string Sorting { get; set; }

        public PagedAndSortedInputDto()
        {
            MaxResultCount = AppConsts.DefaultPageSize;
        }
    }
}