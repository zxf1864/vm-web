import ReactDOM from 'react-dom';
import React from 'react';
import {Layout, Modal, Menu, Breadcrumb, Form, Icon, Input, Button, Checkbox} from 'antd';
const {Header, Content, Footer, Sider} = Layout;
const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;
import {Switch, BrowserRouter, HashRouter, Route} from 'react-router-dom';

import "./events_dispatcher";


import "antd/dist/antd.css";
import '../../scss/base/edit_form.scss';
import {ajax, commons} from "../base/vm_util";


var EditFormWillBeWrap = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount(){

    },
    handleCancel () {

        const {handleCancel} = this.props;

        if (!isUndefined(handleCancel)) {
            handleCancel();
        }
    },
    handleSubmit (e){

        const {handleSubmit} = this.props;

        e.preventDefault();
        this.props.form.validateFields(function (err, values) {
            if (!err) {
                if (!isUndefined(handleSubmit)) {
                    handleSubmit(values);
                }
            }
        }.bind(this));

    },
    // generateFormItems(formItems){
    //     //get props.form
    //
    //
    //     const {getFieldDecorator} = this.props.form;
    //
    //     var formItemsRes = formItems.map(function (formItem, i) {
    //
    //         return (
    //             <FormItem key={i}>
    //                 {formItem}
    //             </FormItem>
    //         );
    //     });
    //     return formItemsRes;
    // },
    render: function () {

        const {getFieldDecorator} = this.props.form;

        //get props
        const {loading, formItems} = this.props;

        // var formItemsRes = this.generateFormItems(formItems);

        return (
            <Form onSubmit={this.handleSubmit} id="edit-form" ref="edit_form">
                {/*{*/}
                    {/*formItemsRes*/}
                {/*}*/}

                <FormItem>
                    <Button loading={loading} type="primary" htmlType="submit" id="edit-form-button">
                        提交
                    </Button>
                </FormItem>
            </Form>
        );
    }
})

//create form
// const LoginForm = Form.create()(<LoginFormWillBeWrap/>);
const EditForm = Form.create()(EditFormWillBeWrap)
export default EditForm;   //将App组件导出

