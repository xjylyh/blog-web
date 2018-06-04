import {get,post,put,del} from './index';
import qs from 'qs';
const ENTITY = '/api/categories';
//查看分类列表  pageNum pageSize keyword
function list({pageNum = 1,pageSize = 5,keyword=''}){
    console.log(keyword);
    return get(`${ENTITY}?pageNum=${pageNum}&pageSize=${pageSize}&keyword=${keyword}`);
}
function create(category){
    return post(ENTITY,category);
}
function update(category){
    return put(`${ENTITY}/${category.id}`,category);
}
function remove(ids){
    if(!ids){
        return false;
    }
    if(typeof ids == 'string'){
        ids = [ids];
    }
    return  del(`${ENTITY}/${ids[0]}`,{ids});
}
export default {
    list,create,update,remove
}
