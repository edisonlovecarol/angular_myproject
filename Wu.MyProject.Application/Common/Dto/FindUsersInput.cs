using Wu.MyProject.Dto;

namespace Wu.MyProject.Common.Dto
{
    public class FindUsersInput : PagedAndFilteredInputDto
    {
        public int? TenantId { get; set; }
    }
}