import React,{Component} from 'react';
import {Table,Input,Popconfirm,Button,Form,message,Row,Col,Modal,Select,Card,List, Avatar, Spin} from 'antd';
import articleService from '../../service/article';
import categoryService from '../../service/category';
import moment from 'moment';
import 'moment/locale/zh-cn';
//moment.locale('zh-cn'); //local->本地  locale->时区
export default class Article extends Component {
    //属性赋给实例（this）
    state={
        categories:[],
        items:[],
        editVisible:false,
        commentVisible:false,
        isCreate:true,
        item:{},
        loading:false,
        viewVisible:false,
        pagination:{},
        keyword:'',
        selectedRowkeys:[]
    }
    componentDidMount(){
        categoryService.list({pageNum:1,pageSize:10}).then(res=>{
            if(res.code==0){
                this.setState({categories:res.data.items})
            }
        })
        this.getList();
    }
    onPageChange=(current)=>{
        this.setState({
            pagination:{
                ...this.state.pagination,
                current
            }
        },this.getList)
    }
    getList=()=>{
        this.setState({loading:true});
        articleService.list({pageNum:this.state.pagination.current,pageSize:this.state.pagination.pageSize,keyword:this.state.keyword}).then(res=>{
            this.setState({loading:false});
            if(res.code==0){
                const {items,pageNum:current,pageSize,total} = res.data;
                this.setState({
                    items,
                    pagination:{
                        current,
                        pageSize,
                        total,
                        showQuickJumper:true,
                        showTotal:total=>`共计${total}条`,
                        onChange:this.onPageChange
                    }
                });
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
        articleService[this.state.isCreate?'create':'update'](article).then(res=>{
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
    edit=(item)=>{
        this.setState({editVisible:true,item,isCreate:false,title:'编辑文章'})
    }
    view=(item)=>{
        articleService.addPv(item._id).then(res=>{
            if(res.code==0){
                this.setState({item,viewVisible:true},this.getList);
            }else{
                message.error(res.data);
            }
        })
    }
    viewCancel=()=>{
        this.setState({viewVisible:false});
    }
    handleSearch=(keyword)=>{
        this.setState({
            keyword,
            pagination:{
                ...this.state.pagination,
                current:1
            }
        },this.getList);
    }
    commentCancel=()=>{
        this.setState({commentVisible:false})
    }
    commentOk=()=>{
        let comment = this.commentForm.props.form.getFieldsValue();
        console.log(comment);
        if(comment.content){
            articleService.addComment(this.state.item._id,comment).then(res=>{
                if(res.code==0){
                    this.setState({commentVisible:false},this.getList);
                }else{
                    message.error(res.data);
                }
            })
        }else{
            message.info('请输入评论或关闭弹窗');
        }
    }
    comment=(item)=>{
        this.setState({
            commentVisible:true,
            item
        })
    }
    deleteComponent=(article_id,comment_id)=>{
        articleService.removeComment(article_id,comment_id).then(res=>{
            if(res.code==0){
                message.info('删除评论成功');
                this.setState({commentVisible:false},this.getList);
            }else{
                message.error(res.data);
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
                render:(text,record)=>text.name//text本来是一个字符串，populate之后text是一个对象
                
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
                render:(text)=>moment(text).fromNow()
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
                render:(text,record,index)=>{
                    return (
                        <Button.Group>
                            <Button 
                            type="dashed" 
                            icon="plus-circle"
                            onClick={()=>this.view(record)}
                            >查看</Button>
                            <Button 
                            style={{marginLeft:5}} 
                            type="primary" 
                            icon="minus-circle"
                            onClick={()=>this.edit(record)}
                            >编辑</Button>
                            <Button 
                            style={{marginLeft:5}} 
                            type="primary" 
                            icon="minus-circle"
                            onClick={()=>this.comment(record)}
                            >评论</Button>
                            <Popconfirm onConfirm={()=>this.remove(record._id)}>
                                <Button style={{marginLeft:5}} type="danger" icon="minus-circle">删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]
        let rowSelection = {
            onChange:(selectedRowkeys)=>{
                this.setState({
                    selectedRowkeys,
                    pagination:{
                        ...this.state.pagination,
                        current:1
                    }
                });
            }
        };
        return (
           <Row>
               <Col span="24" style={{padding:10}}>
                    <Row>
                        <Col span="12">
                            <Button.Group>
                                <Button type="dashed" icon="plus-circle" onClick={this.create}>添加文章</Button>
                                <Button type="danger" icon="minus-circle" onClick={()=>this.remove(this.state.selectedRowkeys)}>删除文章</Button>
                            </Button.Group>
                        </Col>
                        <Col span="12">
                            <Input.Search enterButton onSearch={this.handleSearch}/>
                        </Col>
                    </Row>
                    <Table columns={columns}
                        dataSource={this.state.items}
                        bordered
                        rowKey={record=>record._id}
                        pagination={this.state.pagination}
                        rowSelection={rowSelection}
                        loading={this.state.loading}
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
                        item={this.state.item}
                        ></WrappedEditModal>
                    </Modal>
                    <Modal
                    closable
                    visible={this.state.viewVisible}
                    onCancel={this.viewCancel}
                    footer={null}
                    >
                        <WrappedViewModal
                        item={this.state.item}
                        ></WrappedViewModal>
                    </Modal>
                    <Modal
                    visible={this.state.commentVisible}
                    onCancel={this.commentCancel}
                    onOk={this.commentOk}
                    destroyOnClose
                    >
                        <WrappedCommentModal
                        wrappedComponentRef={inst=>this.commentForm=inst}
                        item={this.state.item}
                        deleteComponent={this.deleteComponent}
                        ></WrappedCommentModal>
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
                            initialValue:this.props.isCreate?this.props.categories[0]._id:this.props.item.category._id,
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
                            initialValue:this.props.isCreate?'':this.props.item.title,                            
                            rules:[{required:true,message:'请输入标题'}]
                        })(
                            <Input placeholder="请输入标题"/>
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('content',{
                            initialValue:this.props.isCreate?'':this.props.item.content,                                                        
                            rules:[{required:true,message:'请输入内容'}]
                        })(
                            <Input.TextArea placeholder="请输入内容"/>
                        )
                    }
                </Form.Item>
                {
                    !this.isCreate && <Form.Item>
                        {
                            getFieldDecorator('id',{
                                initialValue:this.props.item._id                                                        
                            })(
                                <Input type="hidden"/>
                            )
                        }
                    </Form.Item>
                }
                
            </Form>
        )
    }
}

class ViewModal extends Component{
    render(){
        return (
            <Card title="查看文章" style={{marginTop:20}}>
                <p>标题:{this.props.item.title}</p>
                <p>内容:{this.props.item.content}</p>                
            </Card>
        )
    }
}

class CommentModal extends Component{
    state={
        start:0,//开始的索引
        limit:5,
        loading:false,
        comments:this.props.item.comments.slice(0,5)
    }
    loadMore=()=>{
        this.setState({loading:true});
        setTimeout(()=>{
            this.setState({
                start:this.state.start+this.state.limit
            },()=>{
                this.setState({
                    comments:this.props.item.comments.slice(0,this.state.start+this.state.limit),
                    loading:false
                })
                console.log(this.state);
            })
        },2000)
        
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const loadMore = (
            this.state.start+this.state.limit<this.props.item.comments.length&&
            <div style={{marginTop:20,textAlign:'center'}}>
                {this.state.loading?<Spin/>:<Button onClick={this.loadMore}>加载更多</Button>}
                
            </div>
        )
        return (
            <Row>
                <Col>
                    <Form>
                        <Form.Item>
                            {
                                getFieldDecorator('content')(
                                    <Input placeholder="请输入评论内容"></Input>
                                )
                            }
                        </Form.Item>
                    </Form>
                    <List
                    loading={this.state.loading}
                    dataSource={this.state.comments}
                    loadMore={loadMore}
                    renderItem={
                        item=>(
                            <List.Item actions={[<Button 
                            type="danger" 
                            icon="delete" 
                            onClick={()=>this.props.deleteComponent(this.props.item._id,item._id)}
                            >删除</Button>]}>
                                <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={item.user.username}
                                description={item.user.email}
                                />
                                <div>{item.content}</div>
                            </List.Item>
                        )
                    }
                    />
                </Col>
               
            </Row>
            
        )
    }
}
const WrappedEditModal = Form.create()(EditModal);
const WrappedViewModal = Form.create()(ViewModal);
const WrappedCommentModal = Form.create()(CommentModal);