import React,{Component} from 'react';
import {Table,Input,Popconfirm,Button,Form,message,Row,Col} from 'antd';

export default class Article extends Component {
    //属性赋给实例（this）
    state={
        items:[]
    }
    //方法赋给原型(this.prototype)
    render(){
        //标题 内容 分类 阅读量 添加时间 最后修改时间 评论数 操作
        let columns = [
            {
                title:'标题',
                dataIndex:'title',
                key:'title'
            },
            {
                title:'内容',
                dataIndex:'content',
                key:'content'
            }
        ]
        return (
           <Row>
               <Col span="24" style={{padding:10}}>
                    <Row>
                        <Col span="12">
                            <Button.Group>
                                <Button type="dashed" icon="plus-circle">添加文章</Button>
                                <Button type="danger" icon="minus-circle">删除文章</Button>
                            </Button.Group>
                        </Col>
                        <Col span="12">
                            <Input.Search enterButton/>
                        </Col>
                    </Row>
                    <Table columns={columns}
                        dataSource={this.state.items}
                    /> 
               </Col>
           </Row>
        )
    }
}