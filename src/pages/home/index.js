import React,{Component} from 'react';
import {Form,Icon,Input,Button,Popconfirm,Modal,message} from 'antd';
import service from '../../service/user'
export default class Home extends Component{
    handleSubmit = (isSignUp,user)=>{
        console.log(user);
        service[isSignUp?'singup':'singin'](user).then((res)=>{
            console.log(res);
            if(res.code == 0){
                if(!isSignUp){
                    sessionStorage.setItem('username',res.data.user.username);
                }
                console.log('?????',this.props.history);
                this.props.history.push('/admin');
            }else{
                message.error(res.error);
            }
        })
    }
    render(){
        return (
            <div className="home-page">
                <div className="login-form">
                    <h1>welcome my blog</h1>
                    <WrappedUserForm onSubmit={this.handleSubmit}/>
                </div>
            </div>
        )
    }
}
class UserForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            isSignUp:true//默认是一个注册表单
        }
    }
    checkUsername = (rule,value,callback)=>{
        if(!value){
            callback('用户名不能为空')
        }else if(!/^1\d{10}$/.test(value)){
            callback('用户名必须是一个手机号')
        }else{
            callback();
        }
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={(e)=>{
                e.preventDefault();
                this.props.onSubmit(
                    this.state.isSignUp,
                    this.props.form.getFieldsValue()
                )
            }}>
                <Form.Item>
                    {
                        getFieldDecorator('username',{
                            rules:[{
                                validator:this.checkUsername
                            },{
                                required:true,message:'请输入用户名'
                            }]
                        })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="请输入用户名"/>)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('password',{
                            rules:[{
                                required:true,message:'请输入密码'
                            }]
                        })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码"/>)
                    }
                </Form.Item>
                {
                    this.state.isSignUp&&<Form.Item>
                        {
                            getFieldDecorator('email',{
                                rules:[{
                                    required:true,message:'请输入邮箱'
                                }]
                            })(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="请输入密码"/>)
                        }
                    </Form.Item>
                }
                <Form.Item>
                    <Button className="login-form-button" htmlType="submit">
                        {this.state.isSignUp?'注册':'登陆'}
                    </Button>
                    <a onClick={()=>this.setState({isSignUp:!this.state.isSignUp})}>{this.state.isSignUp?'已有账号，直接登陆?':'没有账号，请注册'}</a>
                </Form.Item>
            </Form>
        )
    }
}

const WrappedUserForm = Form.create()(UserForm);