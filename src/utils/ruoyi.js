/**
 * 通用js方法封装处理
 * 
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

// 表单重置
export function resetForm(refName) {
    if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
    }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
    var search = params;
    search.params = {};
    if (null != dateRange && '' != dateRange) {
        if (typeof(propName) === "undefined") {
            search.params["beginTime"] = dateRange[0];
            search.params["endTime"] = dateRange[1];
        } else {
            search.params["begin" + propName] = dateRange[0];
            search.params["end" + propName] = dateRange[1];
        }
    }
    return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
    var actions = [];
    Object.keys(datas).some((key) => {
        if (datas[key].dictValue == ('' + value)) {
            actions.push(datas[key].dictLabel);
            return true;
        }
    })
    return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
    var actions = [];
    var currentSeparator = undefined === separator ? "," : separator;
    var temp = value.split(currentSeparator);
    Object.keys(value.split(currentSeparator)).some((val) => {
        Object.keys(datas).some((key) => {
            if (datas[key].dictValue == ('' + temp[val])) {
                actions.push(datas[key].dictLabel + currentSeparator);
            }
        })
    })
    return actions.join('').substring(0, actions.join('').length - 1);
}

// 通用下载方法
export function download(fileName) {
    window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
    var args = arguments,
        flag = true,
        i = 1;
    str = str.replace(/%s/g, function() {
        var arg = args[i++];
        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];

    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }
    return tree;
}

/**
 * 自适应表格列宽
 * @param {*} str 为该列的字段名(传字符串)
 * @param {*} tableData 为该表格的数据源(传变量)
 * @param {*} flag 可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'；为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
 */
export function flexColumnWidth(str, tableData, flag = 'max') {
    try {
        str = str + ''
        let columnContent = ''
        if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
            return ""
        }
        if (!str || !str.length || str.length === 0 || str === undefined) {
            return ""
        }
        if (flag === 'equal') {
            // 获取该列中第一个不为空的数据(内容)
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i][str] && tableData[i][str].length > 0) {
                    // console.log('该列数据[0]:', tableData[0][str])
                    columnContent = tableData[i][str]
                    break
                }
            }
        } else {
            // 获取该列中最长的数据(内容)
            let index = 0
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i][str] === null) {
                    return
                }
                const now_temp = tableData[i][str] + ''
                const max_temp = tableData[index][str] + ''
                if (now_temp.length > max_temp.length) {
                    index = i
                }
            }
            columnContent = tableData[index][str]
        }
        // console.log('该列数据[i]:', columnContent)
        // 以下分配的单位长度可根据实际需求进行调整
        let flexWidth = 0
        for (const char of columnContent) {
            if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
                // 如果是英文字符，为字符分配8个单位宽度
                flexWidth += 15
            } else if (char >= '\u4e00' && char <= '\u9fa5') {
                // 如果是中文字符，为字符分配15个单位宽度
                flexWidth += 17
            } else {
                // 其他种类字符，为字符分配8个单位宽度
                flexWidth += 11
            }
        }
        if (flexWidth < 80) {
            // 设置最小宽度
            flexWidth = 80
        }
        if (flexWidth > 280) {
            // 设置最大宽度
            flexWidth = 280
        }
        return flexWidth + 'px'
    } catch (e) {
        console.log(e)
    }

}