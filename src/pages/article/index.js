import React,{Component} from 'react';
import {Table,Input,Popconfirm,Button,Form,message,Row,Col,Modal,Select} from 'antd';
import articleService from '../../service/article';
import categoryService from '../../service/category';
export default class Article extends Component {
    //属性赋给实例（this）
    state={
        categories:[],
        items:[],
        editVisible:false,
        isCreate:true,
        item:{}
    }
    componentDidMount(){
        categoryService.list({pageNum:1,pageSize:10}).then(res=>{
            if(res.code==0){
                this.setState({categories:res.data.items})
            }
        })
        this.getList();
    }
    getList=()=>{
        articleService.list({}).then(res=>{
            if(res.code==0){
                const {items} = res.data;
                this.setState({items});
            }
        })
    }
    create=()=>{
        this.setState({title:'增加文章',editVisible:true,isCreate:true});
    }
    editCancel=()=>{
        this.setState({editVisible:false});
    }
    editOk=()=>{
        let article = this.editform.props.form.getFieldsValue();
        console.log(article);
        articleService.create(article).then(res=>{
            if(res.code==0){
                this.setState({editVisible:false},this.getList)
            }
        })
    }
    remove=(ids)=>{
        articleService.remove(ids).then(res=>{
            if(res.code==0){
                message.info(res.data);
                this.getList();
            }
        })
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
                key:'content',
                style:{width:'200px',height:'200px',overflow:'hidden'}
            },{
                title:'分类',
                dataIndex:'category',
                key:'category',
                // render:(text,record)=>text.name//text本来是一个字符串，populate之后text是一个对象
                
            },
            {
                title:'阅读量',
                dataIndex:'pv',
                key:'pv'
            },
            {
                title:'创建时间',
                dataIndex:'createAt',
                key:'createAt',
                render:(text)=>text.toLocaleString()
            },
            {
                title:'评论数',
                dataIndex:'comments',
                key:'comments',
                render:(text)=>text.length
            },
            {
                title:'操作',
                dataIndex:'action',
                key:'action',
                render:(text,record)=>{
                    return (
                        <Button.Group>
                            <Button type="dashed" icon="plus-circle">查看</Button>
                            <Button style={{marginLeft:5}} type="primary" icon="minus-circle">编辑</Button>
                            <Button style={{marginLeft:5}} type="primary" icon="minus-circle">评论</Button>
                            <Button style={{marginLeft:5}} type="danger" icon="minus-circle" onClick={()=>this.remove(record._id)}>删除</Button>
                        </Button.Group>
                    )
                }
            }
        ]
        return (
           <Row>
               <Col span="24" style={{padding:10}}>
                    <Row>
                        <Col span="12">
                            <Button.Group>
                                <Button type="dashed" icon="plus-circle" onClick={this.create}>添加文章</Button>
                                <Button type="danger" icon="minus-circle">删除文章</Button>
                            </Button.Group>
                        </Col>
                        <Col span="12">
                            <Input.Search enterButton/>
                        </Col>
                    </Row>
                    <Table columns={columns}
                        dataSource={this.state.items}
                        bordered
                    /> 
                    <Modal
                    title={this.state.title}
                    onCancel={this.editCancel}
                    onOk={this.editOk}
                    destroyOnClose
                    visible={this.state.editVisible}
                    >
                        <WrappedEditModal
                        isCreate={this.state.isCreate}
                        wrappedComponentRef={inst=>this.editform=inst}
                        categories={this.state.categories}
                        ></WrappedEditModal>
                    </Modal>
               </Col>
           </Row>
        )
    }
}

class EditModal extends Component{
    render(){
        const {getFieldDecorator} = this.props.form;
        return (
            <Form >
                <Form.Item>
                    {
                        getFieldDecorator('category',{
                            rules:[{required:true,message:'请输入标题'}]
                        })(
                            <Select>
                            {
                                this.props.categories.map((item)=>(
                                    <Select.Option key={item._id} value={item._id}> 
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('title',{
                            rules:[{required:true,message:'请输入标题'}]
                        })(
                            <Input placeholder="请输入标题"/>
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('content',{
                            rules:[{required:true,message:'请输入内容'}]
                        })(
                            <Input.TextArea placeholder="请输入内容"/>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}
const WrappedEditModal = Form.create()(EditModal);