using System.Collections.Generic;
using MyCompany.Wu.Utility.Query;

namespace Wu.MyProject.Utility.Query
{
    /// <summary>
    /// 筛选条件组
    /// </summary>
    public class FilterGroup
    {
        /// <summary>
        /// 获取或设置 条件集合
        /// </summary>
        public ICollection<FilterRule> Rules { get; set; }

        public FilterOperate Operate { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public PageCondition Pages{ get; set; }



        /// <summary>
        /// 获取或设置 条件组集合
        /// </summary>
        public ICollection<FilterGroup> Groups { get; set; }
    }
}
