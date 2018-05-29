import React,{Component} from 'react';
import {Menu,Icon} from 'antd';
import { withRouter } from 'react-router-dom';
class Navleft extends Component{
    handleClick=({ item, key, keyPath })=>{
        console.log(item,key,keyPath);
        let {history} = this.props;
        history.push(key);
    }
    render(){
        // console.log(window.location.hash.slice(1));
        return (
            <Menu
             mode="inline"
             theme="light"
             defaultSelectedKeys={[window.location.hash.slice(1)]}
             onClick={this.handleClick}
            >
                <Menu.Item key="/admin" title="文章管理">
                    <Icon type="lock" />
                首页
                </Menu.Item>
                <Menu.Item key="/admin/category" title="分类管理">
                    <Icon type="lock" />
                分类管理
                </Menu.Item>
                <Menu.Item key="/admin/article" title="文章管理">
                    <Icon type="book" />
                文章管理
                </Menu.Item>
            </Menu>
        )
    }
}
export default withRouter(Navleft);