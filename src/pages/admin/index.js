import React,{Component} from 'react';
import {Row,Col} from 'antd';
import service from '../../service/user';
import Header from '../../components/Header';
import Navleft from '../../components/Navleft';
import {Route} from 'react-router-dom';
import Welcome from '../welcome';
import Category from '../category';
import Article from '../article'


export default class Admin extends Component{
    render(){
        return (
            <Row className="admin-page" >
                <Col span="24">
                    <Header></Header>
                    <Row style={{overflow:"hidden",width:"100%"}}>
                        <Col span="3">
                            <Navleft />
                        </Col>
                        <Col span="21">
                            <Route exact path="/admin" component={Welcome} />
                            <Route path="/admin/category" component={Category} />
                            <Route path="/admin/article" component={Article} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}