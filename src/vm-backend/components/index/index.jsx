import ReactDOM from 'react-dom';
import React from 'react';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
import HomePage from "../home/home_page";
import {Switch, BrowserRouter, HashRouter, Route, Link} from 'react-router-dom';
import "../base/events_dispatcher";
import Head from "./head";
import LoginDialog from "./login_dialog";
import Nav from "./nav";
import Routes from "./routes";
import {ajax, commons} from "../base/vm_util";


import "antd/dist/antd.css";
import '../../scss/index/index.scss';

var Index = React.createClass({
    getInitialState: function () {
        return {
            collapsed: false
        };
    },
    onCollapse(collapsed){
        // console.log(collapsed);
        this.setState({collapsed});
    },

    render: function () {
        //set now page's props
        const {collapsed} = this.state;


        return (
            <div id="index">
                <HashRouter>
                    <Layout style={{minHeight: '100vh'}}>
                        <Sider
                            style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}
                            collapsible
                            collapsed={collapsed}
                            onCollapse={this.onCollapse}
                        >

                            <div className="logo"/>
                            {/*nav*/}
                            <Nav/>
                        </Sider>
                        <Layout
                            style={{marginLeft: 200}}
                        >
                            {/*style={{background: '#fff', padding: 0}}*/}
                            <Header
                                style={{
                                    marginLeft: 200,
                                    background: '#fff',
                                    padding: 0,
                                    position: 'fixed',
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    zIndex:9,//model之下，Content之上
                                    padding:"0px 35px"
                                }}>
                                {/*head*/}
                                <Head/>
                            </Header>
                            <Content style={{margin: '70px 16px 0', overflow: 'initial'}}>
                                {/*<Breadcrumb style={{margin: '16px 0'}}*/}
                                {/*itemRender={itemRender} routes={routes}>*/}
                                {/*<Breadcrumb.Item>User</Breadcrumb.Item>*/}
                                {/*<Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                                {/*</Breadcrumb>*/}
                                <Routes/>

                            </Content>
                            <Footer style={{textAlign: 'center'}}>
                                Vm backend ©2016 Created by Zhangke
                            </Footer>
                        </Layout>
                    </Layout>

                </HashRouter>
                {/*登录框*/}
                <LoginDialog ref="login_dialog"/>
            </div>
        );
    }
});

export default Index;   //将App组件导出
