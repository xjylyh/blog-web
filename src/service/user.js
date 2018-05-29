import {get,post,put,del} from './index';
const ENTITY = '/api/users';
function singup(data){//data ->{username,password,email}
    return post(`${ENTITY}/signup`,data);
}

function singin(data){
    return post(`${ENTITY}/signin`,data);
}

function singout(){
    return get(`${ENTITY}/signout`)
}

export default {
    singup,
    singin,
    singout
}