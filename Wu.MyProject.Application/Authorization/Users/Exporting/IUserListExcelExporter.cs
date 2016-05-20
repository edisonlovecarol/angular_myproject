using System.Collections.Generic;
using Wu.MyProject.Authorization.Users.Dto;
using Wu.MyProject.Dto;

namespace Wu.MyProject.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos); 
    }
}