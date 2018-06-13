import {get,post,put,del} from './index';
const ENTITY = '/api/articles';
//查看分类列表  pageNum pageSize keyword
function list({pageNum = 1,pageSize = 5,keyword=''}){
    console.log(pageNum,pageSize,keyword);
    return get(`${ENTITY}?pageNum=${pageNum}&pageSize=${pageSize}&keyword=${keyword}`);
}
function create(item){
    return post(ENTITY,item);
}
function update(item){
    return put(`${ENTITY}/${item.id}`,item);
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
function addPv(id){
    return get(`${ENTITY}/pv/${id}`);
}
function addComment(article_id,content){
    return post(`${ENTITY}/comment/${article_id}`,content)
}
function removeComment(article_id,comment_id){
    return del(`${ENTITY}/${article_id}/comment/${comment_id}`)
}
export default {
    list,create,update,remove,addPv,addComment,removeComment
}
