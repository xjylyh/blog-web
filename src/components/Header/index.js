import React,{Component} from 'react';
import {Row,Col,Icon,message} from 'antd';
import user from '../../service/user'
import { withRouter } from 'react-router-dom';
class Header extends Component{
    state={
        username:""
    }
    componentWillMount(){
        let username = sessionStorage.getItem('username');
        this.setState({username})
    }
    logout=()=>{
        user.singout().then(data=>{
            console.log(data);
            if(data.code==0){
                sessionStorage.removeItem('username');
                this.props.history.push('/');
            }else{
                message.error(data.error);
            }
        })
    }
    render(){
        return (
            <Row className="admin-header"style={{padding:'0 20px'}}>
                <Col span="6" >
                    <h2 style={{marginBottom:"0"}}>my blog</h2>
                </Col>
                <Col span="18">
                    <div style={{float:'right',fontSize:16}}>
                        <Icon type="smile"/>欢迎 {this.state.username} 
                        <span onClick={this.logout}>
                            <Icon type="logout"/>退出
                        </span>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default withRouter(Header);