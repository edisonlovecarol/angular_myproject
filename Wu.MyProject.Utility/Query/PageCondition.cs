using MyCompany.Wu.Utility.Query;

namespace Wu.MyProject.Utility.Query
{
    /// <summary>
    /// 分页查询条件信息
    /// </summary>
    public class PageCondition
    {
        /// <summary>
        /// 获取或设置索引
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// 获取或设置页大小
        /// </summary>
        public int PageSize { get; set; }



        /// <summary>
        /// 获取或设置排序条件组
        /// </summary>
        public SortCondition[] SortConditions { get; set; }

        public SortString SortString { get; set; }

        public PageCondition():this(1,20)
        {
            
        }



        public PageCondition(int pageIndex,int pageSize)
        {
            this.PageIndex = pageIndex;
            this.PageSize = pageSize;
            SortConditions=  new SortCondition[]{};

        }



    }
}
