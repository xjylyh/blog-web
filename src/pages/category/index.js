import React,{Component} from 'react';
import cateObj from '../../service/category'
import {Row,Col,Table,Button,Modal,message,Popconfirm,Input} from 'antd';
export default class Category extends Component {
    state = {
        items:[]
    }
    componentDidMount(){
        this.getList();
    }
    getList=()=>{
        cateObj.list().then(res=>{
            console.log(res);
            if(res.code==0){
                this.setState({items:res.data.items.map(item=>(item.key = item._id,item))})
            }else{
                message.error(res.error);
            }
        })
    }
    render(){
        // const dataSource = [
        //     {
        //         _id:1,name:'fl1'
        //     },
        //     {
        //         _id:2,name:'fl2'
        //     }
        // ]
        const columns = [
            {
                title:'名称',
                width:500,
                dataIndex:'name',
                key:"name"
            },
            {
                title:'操作',
                render:(text,record,index)=>{
                    return (
                        <Button.Group>
                            <Button type="primary">修改</Button>
                            <Popconfirm onConfirm={()=>{message.warn('click 确认删除')}}>
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]
        return (
           <div style={{padding:"10px"}}>
               <Row>
                   <Col span="6">
                        <Button.Group>
                            <Button type="default">添加分类</Button>
                            <Button type="danger">删除所选分类</Button>
                        </Button.Group>
                   </Col>
                   <Col span="18">
                        <Input.Search
                            enterButton
                            placeholder="请输入关键字"
                            onSearch={keyword=>{console.log(keyword)}}
                        >
                        </Input.Search>
                   </Col>
               </Row>
               <Table
                    dataSource={this.state.items}
                    columns={columns}
                    bordered
               ></Table>
           </div>
        )
    }
}