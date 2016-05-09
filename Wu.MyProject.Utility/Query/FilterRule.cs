using MyCompany.Wu.Utility.Query;

namespace Wu.MyProject.Utility.Query
{
    /// <summary>
    /// 筛选条件
    /// </summary>
    public class FilterRule
    {


        /// <summary>
        /// 初始化一个<see cref="FilterRule"/>的新实例
        /// </summary>
        public FilterRule()
            : this(null, null)
        { }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="field"></param>
        /// <param name="value"></param>
        public FilterRule(string field, object value)
            : this(field, value, FilterOperate.Equal)
        {
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="field">字段</param>
        /// <param name="value">字段值</param>
        /// <param name="operateCode">前台操作码</param>
        public FilterRule(string field, object value, string operateCode)
            : this(field, value, (FilterOperate) FilterHelper.GetFilterOperate(operateCode))
        { }
            
        


        /// <summary>
        /// 使用指定数据名称，
        /// </summary>
        /// <param name="field">字段名称</param>
        /// <param name="value">字段值</param>
        /// <param name="operate">操作方式</param>
        public FilterRule(string field,object value,FilterOperate operate)
        {
            Field = field;
            Value = value;
            Operate = operate;
        }


        #region 属性

        /// <summary>
        /// 获取或设置 属性名称
        /// </summary>
        public string Field { get; set; }

        /// <summary>
        /// 获取或设置 属性值
        /// </summary>
        public object Value { get; set; }

        /// <summary>
        /// 获取或设置 操作类型
        /// </summary>
        public FilterOperate Operate { get; set; }

        #endregion
    }
}
