import React,{Component} from 'react';
import categoryService from '../../service/category'
import {Row,Col,Table,Button,Modal,message,Popconfirm,Input,Form} from 'antd';
export default class Category extends Component {
    state = {
        items:[],
        item:{},
        isCreate:true,//标识是否添加分类,如果为true就是添加分类，如果为false就是修改
        title:"",
        editVisible:false,
        pagination:{},
        selectedRowKeys:[],//删除选中行的id所组成的数组
        keyword:''
    }
    componentDidMount(){
        this.getList();
    }
    pageChange=(current)=>{//点击分页器页码的时候会把最新的页码传过来
        this.setState({
            pagination:{
                ...this.state.pagination,
                current
            }
        },this.getList);
    }
    create=()=>{//开始执行添加操作
        this.setState({
            title:'添加分类',
            isCreate:true,
            editVisible:true//此变量用来控制模态窗口是否显示
        })
    }
    getList=()=>{
        categoryService.list({pageNum:this.state.pagination.current,keyword:this.state.keyword}).then(res=>{
            if(res.code==0){
                const {items,pageNum:current,total,pageSize} = res.data;
                this.setState({
                    items:res.data.items.map(item=>(item.key = item._id,item)),
                    pagination:{
                        current,//当前页码
                        pageSize,//每页条数
                        total,//总条数
                        showTotal:(count)=>`总计${count}条`,
                        onChange:this.pageChange,
                        showQuickJumper:true
                    }
                })
            }else{
                message.error(res.error);
            }
        })
    }
    editCancel=()=>{//点击时关闭模态窗
        this.setState({editVisible:false})
    }
    editOk=()=>{//点击模态窗的ok按钮的时候，需要把分类信息保存到后台数据库，并且关闭窗口
        let categy = this.editform.props.form.getFieldsValue();
        categoryService[this.state.isCreate?'create':'update'](categy).then(res=>{
            if(res.code==0){
                this.setState({editVisible:false})
                this.getList();          
            }else{
                message.error(res.error);
            }
        })
    }
    edit=(item)=>{
        console.log(item);
        this.setState({title:"更新分类",editVisible:true,isCreate:false,item})
    }
    remove=(id)=>{
        categoryService.remove(id).then(res=>{
            if(res.code==0){
                this.setState({
                        pagination:{
                        ...this.state.pagination,
                        current:1
                    }
                })
                this.getList();
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
                            <Button type="primary" onClick={()=>this.edit(record)}>修改</Button>
                            <Popconfirm onConfirm={()=>this.remove(record._id)}>
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]
        const rowSelection = {
            /**
             * 参数为选中的行的键组成的数组
             */
            onChange:(selectedRowKeys,selectedRows)=>{
                console.log(selectedRowKeys,selectedRows);
                this.setState({selectedRowKeys});
            }
        };
        return (
           <div style={{padding:"10px"}}>
               <Row style={{marginBottom:15}}>
                   <Col span="12">
                        <Button.Group>
                            <Button onClick={this.create} icon="plus-circle" type="default">添加分类</Button>
                            <Button
                            style={{marginLeft:15}}
                            type="danger" icon="delete" onClick={()=>this.remove(this.state.selectedRowKeys)}>删除所选分类</Button>
                        </Button.Group>
                   </Col>
                   <Col span="12">
                        <Input.Search
                            enterButton
                            placeholder="请输入关键字"
                            onSearch={keyword=>this.setState({keyword},this.getList)}
                        >
                        </Input.Search>
                   </Col>
               </Row>
               <Table
                    dataSource={this.state.items}
                    columns={columns}
                    bordered
                    pagination={this.state.pagination}
                    rowSelection={rowSelection}
               ></Table>
               <Modal
                title={this.state.title}
                visible={this.state.editVisible}
                onCancel={this.editCancel}
                onOk={this.editOk}
                destroyOnClose
               >
                    <WrappedEditModal
                        wrappedComponentRef = {inst=>this.editform=inst}
                        isCreate={this.state.isCreate}
                        item={this.state.item}
                    ></WrappedEditModal>
               </Modal>
           </div>
        )
    }
}

class EditModal extends Component{
    render(){
    const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('name',{
                            initialValue:this.props.isCreate?'':this.props.item.name,
                            rules:[{required:true,message:'请输入分类名称'}]
                        })(<Input placeholder="请输入分类名称"/>)
                    }
                </Form.Item>
                {
                    !this.props.isCreate&&(
                        <Form.Item>
                            {
                                getFieldDecorator('id',{
                                    initialValue:this.props.item._id
                                })(<Input type="hidden"/>)
                            }
                        </Form.Item>
                    )
                }
            </Form>
        )
    }
}
//凡是传给WrappedEditModal的属性也会原封不动的穿给EditModal
const WrappedEditModal = Form.create()(EditModal);