import {get,post,put,del} from './index';
import qs from 'qs';
const ENTITY = '/api/categories';
//查看分类列表  pageNum pageSize keyword
console.log(qs);
function list(query){
    return get(`${ENTITY}?${qs.stringify(query)}`);
}

export default {
    list
}
