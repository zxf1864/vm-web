import React from "react";
import {Button, DatePicker, Icon, Input, Layout, Menu, message, Select, Table} from "antd";
import moment from 'moment';
import {withRouter} from "react-router-dom";
import "antd/dist/antd.css";
import "../../scss/user/user_page.scss";
import "../base/events_dispatcher";
import {ajax, commons} from "../base/vm_util";
import EditDialogTemple from "../base/edit_dialog_temple";
const Option = Select.Option;
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const Search = Input.Search;
const TextArea = Input.TextArea;
var UserPage = React.createClass({
        getInitialState: function () {
            return {
                userEditDialog: {
                    echoData: undefined
                },
                userTable: {
                    dataSourceUrl: "/user/list",
                    editable: false,
                    haveSearchUsername: false,
                    usernameDropdownVisible: false,
                    bordered: false,
                    tableLoading: false,
                    batchDeleteBtnLoading: false,
                    selectedRowKeys: [],
                    originalData: [],
                    page: {
                        start: 0,
                        size: 5,
                        orderBy: "",
                        orderType: "",
                        total: 0
                    },
                    query: {
                        usernameQuery: ""
                    },
                    columns: [],
                    data: []
                }
            }
        },
        onSearchUsername(newUsernameQuery)
        {
            this.updateUserTableUsernameQuery(newUsernameQuery);
            if (!isEmptyString(this.state.userTable.query.usernameQuery)) {
                this.updateUserTableHaveSearchUsername(true);
            } else {

                this.updateUserTableHaveSearchUsername(false);
            }
            this.loadUserTableData();
        },
        updateUserTableHaveSearchUsername(haveSearchUsername)
        {
            var state = this.state;
            state.userTable.haveSearchUsername = haveSearchUsername;
            this.setState(state);
        },
        updateUserTableUsernameDropdownVisible(usernameDropdownVisible)
        {
            var state = this.state;
            state.userTable.usernameDropdownVisible = usernameDropdownVisible;
            this.setState(state);
        },
        updateUserTableSelectedRowKeys(selectedRowKeys)
        {
            var state = this.state;
            state.userTable.selectedRowKeys = selectedRowKeys;
            this.setState(state);
        },
        updateUserTableUsernameQuery(newUsernameQuery)
        {
            var state = this.state;
            state.userTable.query.usernameQuery = newUsernameQuery;
            this.setState(state);
        },
        updateUserTableData(data)
        {
            var state = this.state;
            state.userTable.data = data;
            this.setState(state);
        },
        updateUserTablePage(page)
        {
            var state = this.state;
            state.userTable.page = page;
            this.setState(state);
        },
        updateUserTableQuery(query)
        {
            var state = this.state;
            state.userTable.query = query;
            this.setState(state);
        },
        updateUserTableLoading(flag)
        {
            var state = this.state;
            state.userTable.tableLoading = flag;
            this.setState(state);
        },
        updateUserTableColumns(columns)
        {

            var state = this.state;
            state.userTable.columns = columns;
            this.setState(state);
        },
        updateUserTableOriginalData(originalData){
            var state = this.state;
            state.userTable.originalData = originalData;
            this.setState(state);
        },
        updateUserEditDialogEchoData(echoData){
            var state = this.state;
            state.userEditDialog.echoData = echoData;
            this.setState(state);
        },
        componentDidMount()
        {
            this.updateUserTableColumns([
                {
                    title: 'id',
                    width: 100,
                    dataIndex: 'id',
                    sorter: (a, b) => {
                    }
                },
                {
                    title: '头像',
                    width: 100,
                    dataIndex: 'imgUrl',
                    render: (text) => {
                        const imgUrl = vm_config.http_url_prefix + text;
                        return <img style={{width: 50, height: 50}} src={imgUrl}/>
                    }
                },
                {
                    title: '用户名',
                    width: 100,
                    dataIndex: 'username',
                    render: (text, record) => {
                        return commons.highLight(text, this.state.userTable.query.usernameQuery);
                    },
                    sorter: (a, b) => {
                    },
                    filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Search
                                placeholder="搜索用户名"
                                onSearch={this.onSearchUsername}
                                style={{width: 200}}
                            />
                        </div>
                    ),
                    filterIcon: <Icon type="search"
                                      style={{color: this.state.userTable.haveSearchUsername ? '#108ee9' : '#aaa'}}/>,
                    // filterDropdownVisible: this.state.userTable.usernameDropdownVisible,

                },


                {
                    title: '性别',
                    width: 100,
                    dataIndex: 'sex',
                    render: (text) => {
                        var res = text;
                        if (text == 1) {
                            res = "男";
                        }
                        if (text == 2) {
                            res = "女";
                        }
                        if (text == 3) {
                            res = "未知";
                        }
                        return res;
                    },
                    sorter: (a, b) => {
                    }


                },
                {
                    title: '密码', width: 100,
                    dataIndex: 'password',
                    sorter: (a, b) => {
                    }
                },
                {
                    title: '简介', width: 200,
                    dataIndex: 'description',
                    sorter: (a, b) => {
                    }
                },
                {
                    title: '生日',
                    width: 100,
                    dataIndex: 'birthday',
                    render: (text) => {
                        return timeFormatter.formatDate(text * 1000);
                    },
                    sorter: (a, b) => {
                    }
                },
                {
                    title: '创建时间',
                    width: 100,
                    dataIndex: 'create_time',
                    render: (text) => {
                        return timeFormatter.formatTime(text * 1000);
                    },
                    sorter: (a, b) => {
                    },
                    defaultSortOrder: 'descend',
                },
                {
                    title: '最后更新时间',
                    width: 100,
                    dataIndex: 'update_time',
                    render: (text) => {

                        return timeFormatter.formatTime(text * 1000);
                    },
                    sorter: (a, b) => {
                        return a.username.length - b.username.length;
                    }
                },
                {
                    title: '状态',
                    width: 100,
                    dataIndex: 'status',
                    render: (text) => {
                        return text == 1 ? "正常" : text == 2 ? "冻结" : text;
                    },
                    sorter: (a, b) => {
                    }
                },


                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 150,
                    render: (text,record) => {
                        return <div>
                            <a onClick={()=>this.showEditDialog(record)} href="javascript:void(0);">编辑</a>&nbsp;&nbsp;
                            <a onClick={this.deleteRecord} href="javascript:void(0)">删除</a>
                        </div>
                    },
                },]);
            this.loadUserTableData();
        },
        handleTableChange(pagination, filters, sorter)
        {
            const page = this.state.userTable.page;
            var size = pagination.pageSize;
            var start = (pagination.current - 1) * size;
            var orderBy = sorter.field;
            var orderType = sorter.order;
            this.updateUserTablePage({
                start: start,
                size: size,
                orderBy: orderBy,
                orderType: orderType,
                total: page.total
            });
            this.loadUserTableData();
        },
        loadUserTableData()
        {
            this.updateUserTableLoading(true);
            const {page, query} = this.state.userTable;
            //filter
            var orderType = page.orderType;
            if (orderType == "descend") {
                orderType = "desc";
            }
            if (orderType == "ascend") {
                orderType = "asc";
            }
            page.orderType = orderType;

            //ajax
            ajax.get({
                url: this.state.userTable.dataSourceUrl,
                data: $.extend(page, query),
                success: function (result) {
                    //save data
                    this.updateUserTableOriginalData(result.data.list);

                    //handle data
                    const data = [];
                    $.each(result.data.list, function (i, item) {

                        data.push({
                            key: item.id,
                            id: item.id,
                            imgUrl: item.imgUrl,
                            username: item.username,
                            sex: item.sex,
                            password: item.password,
                            description: item.description,
                            birthday: item.birthday,
                            create_time: item.createTime,
                            update_time: item.updateTime,
                            status: item.status,
                        });
                    }.bind(this));
                    this.updateUserTableData(data);
                    var page = this.state.userTable.page;
                    this.updateUserTablePage({
                        start: page.start,
                        size: page.size,
                        orderBy: page.orderBy,
                        orderType: page.orderType,
                        total: result.data.total
                    });
                    this.updateUserTableLoading(false);
                }.bind(this)
            });
        },
        showEditDialog(record)
        {
            record = commons.getObjByKey(this.state.userTable.originalData,"id",record.id);
            this.updateUserEditDialogEchoData(record)

            this.getUserEditDialog().showDialog();

        },
        deleteRecord()
        {
            c("deleteRecord");

        },
        batchDeleteRecord()
        {
            c("batchDeleteRecord");

        },
        showAddDialog()
        {
            c("showAddDialog");
            this.getUserAddDialog().showDialog();
        },
        getUserAddDialog()
        {
            return this.refs.user_add_dialog;
        },
        getUserEditDialog()
        {
            return this.refs.user_edit_dialog;
        },
        render: function () {

            const {echoData} = this.state.userEditDialog;

            const {selectedRowKeys, columns, data, page, tableLoading, batchDeleteBtnLoading, bordered} = this.state.userTable;

            const rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.updateUserTableSelectedRowKeys(selectedRowKeys);
                    var selectedRowKeys = this.state.userTable.selectedRowKeys;
                    c(`selectedRowKeys is : ${selectedRowKeys}`, selectedRowKeys);

                },
                onSelect: (record, selected, selectedRows) => {
                    // c(record, selected, selectedRows);
                },
                onSelectAll: (selected, selectedRows, changeRows) => {
                    // c(selected, selectedRows, changeRows);
                },
            };
            const hasSelected = selectedRowKeys.length > 0;
            //set now page's props
            return (
                <div>
                    <div style={{marginBottom: 16}}>
                        <Button
                            type="primary"
                            onClick={this.showAddDialog}
                        >
                            添加
                        </Button>
                        <Button
                            style={{marginLeft: 8}}
                            type="danger"
                            onClick={this.batchDeleteRecord}
                            disabled={!hasSelected}
                            loading={batchDeleteBtnLoading}
                        >
                            批量删除
                        </Button>

                        <span style={{marginLeft: 8}}>
                        {hasSelected ? `选择了 ${selectedRowKeys.length} 个选项` : ''}
                    </span>
                    </div>
                    <Table columns={columns}
                           rowSelection={rowSelection}
                           dataSource={data}
                           pagination={
                               {
                                   total: page.total,
                                   showTotal: (total, range) => {
                                       return `第 ${range[0]}-${range[1]} 条记录 , 共 ${total} 条记录`;
                                   },
                                   pageSize: page.size,
                                   defaultCurrent: 1
                               }
                           }
                           loading={tableLoading}
                           onChange={this.handleTableChange}
                           bordered={bordered}
                           title={() => '用户列表'}
                        // footer={() => 'Footer'}
                           scroll={{x: "100%", y: "100%"}}/>

                    <UserEditDialog ref="user_edit_dialog"
                                    echoData={echoData}/>
                    <UserAddDialog ref="user_add_dialog"/>
                </div>
            );
        }
    })
;


var UserEditDialog = React.createClass({
    getInitialState(){
        return {
            editUserUrl: "/user/info",
        };
    },
    showDialog(){
        this.getUserEditDialog().showDialog();
    },
    getUserEditDialog(){
        return this.refs.user_edit_dialog;
    },
    handleSubmit(values){
        const hideMessage = message.loading('正在修改用户', 0);
        const {editUserUrl} = this.state;
        var filterValues = function (values) {
            values.birthday = timeFormatter.long2Int(new Date(values.birthday._d).getTime());
            return values;
        }
        values = filterValues(values);
        ajax.put({
            url: editUserUrl,
            data: values,
            success: function (result) {
                message.success(result.msg);
                this.getUserAddDialog().closeDialog();


            }.bind(this),
            failure: function (result) {
                message.error(result.msg);

            },
            complete: function () {
                hideMessage();
                this.getUserEditDialog().formLeaveLoading();
            }.bind(this)
        });

    },
    handleCancel(){

        c("handleCancel");
    },
    componentDidMount(){

    },
    render(){
        var {echoData} = this.props;

        var filterEchoData = function (echoData) {
            if (isUndefined(echoData)) {
                return {};
            }
            if (!isUndefined(echoData.birthday)) {
                echoData.birthday = moment(1520497952);
            }
            if (!isUndefined(echoData.createTime)) {
                echoData.createTime = "创建时间 : " + timeFormatter.formatDate(echoData.createTime);
            }
            if (!isUndefined(echoData.updateTime)) {
                echoData.updateTime = "最后更新时间 : " + timeFormatter.formatDate(echoData.updateTime);

            }
            return echoData;
        }
        echoData = filterEchoData(echoData);
        c(echoData.birthday);
        var formItems = [
                {

                    filed: {
                        id: "id",
                        config: {
                            initialValue: echoData.id,
                        },
                        input: <Input name="id" disabled={true}/>
                    }
                },
                {

                    filed: {
                        id: "username",
                        config: {
                            initialValue: echoData.username,
                            rules: [{required: true, whitespace: true, message: '请输入用户名!'}],
                        },
                        input: <Input name="username" prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                      placeholder="用户名"/>
                    }
                }
                ,
                {
                    filed: {
                        id: "password",
                        config: {
                            initialValue: echoData.password,
                            rules: [{required: true, whitespace: true, message: '请输入密码!'}],
                        }
                        ,
                        input: <Input name="password" prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                      placeholder="密码"/>
                    }
                }
                ,
                {
                    filed: {
                        id: "sex",
                        config: {
                            initialValue: echoData.sex,
                            rules: [
                                {required: true, message: '请输入你的性别!'}],
                        }
                        ,
                        input: <Select placeholder="请输入你的性别">
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                            <Option value="3">未知</Option>
                        </Select>
                    }
                }
                ,
                {
                    filed: {
                        id: "birthday",
                        config: {
                            initialValue: echoData.birthday,
                            rules: [{type: 'object', required: true, message: '请输入你的生日!'}],

                        }
                        ,
                        input: <DatePicker name="birthday"/>
                    }
                }
                ,
                {
                    filed: {
                        id: "description",
                        config: {
                            initialValue: echoData.description,
                            rules: [{required: true, message: '请输入简介!'}],
                        }
                        ,
                        input: <TextArea placeholder="请输入简介" autosize={{minRows: 4, maxRows: 8}}/>
                    }
                }
                ,
                {
                    filed: {
                        id: "status",
                        config: {
                            initialValue: echoData.status,
                            rules: [{required: true, message: '请输入状态!'}],
                        }
                        ,
                        input: <Select placeholder="请输入状态">
                            <Option value="1">正常</Option>
                            <Option value="2">冻结</Option>
                        </Select>
                    }
                },
                {
                    filed: {
                        id: "createTime",
                        config: {
                            initialValue: echoData.createTime,
                        }
                        ,
                        input: <Input disabled={true}/>
                    }
                },
                {
                    filed: {
                        id: "updateTime",
                        config: {
                            initialValue: echoData.updateTime,
                        }
                        ,
                        input: <Input disabled={true}/>
                    }
                }

            ]
        ;
        return <EditDialogTemple
            title="修改用户"
            formItems={formItems}
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
            ref="user_edit_dialog"/>;
    }
});
var UserAddDialog = React.createClass({
    getInitialState(){
        return {
            addUserUrl: "/user/info",
        };
    },
    showDialog(){
        this.getUserAddDialog().showDialog();
    }
    ,
    getUserAddDialog(){
        return this.refs.user_add_dialog;
    },
    handleSubmit(values){
        const hideMessage = message.loading('正在添加用户', 0);
        const {addUserUrl} = this.state;
        var filterValues = function (values) {
            values.birthday = timeFormatter.long2Int(new Date(values.birthday._d).getTime());
            return values;
        }
        values = filterValues(values);
        ajax.post({
            url: addUserUrl,
            data: values,
            success: function (result) {
                message.success(result.msg);
                this.getUserAddDialog().closeDialog();


            }.bind(this),
            failure: function (result) {
                message.error(result.msg);

            },
            complete: function () {
                hideMessage();
                this.getUserAddDialog().formLeaveLoading();
            }.bind(this)
        });

    },
    handleCancel(){

        c("handleCancel");
    },
    componentDidMount(){

    },
    render(){
        // var getFieldDecorator = this.getUserAddDialog().getFieldDecorator();
        var formItems = [
            {

                filed: {
                    id: "username",
                    config: {
                        rules: [{required: true, whitespace: true, message: '请输入用户名!'}],
                    },
                    input: <Input name="username" prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                  placeholder="用户名"/>
                }
            }
            ,
            {
                filed: {
                    id: "password",
                    config: {
                        rules: [{required: true, whitespace: true, message: '请输入密码!'}],
                    },
                    input: <Input name="password" prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                  placeholder="密码"/>
                }
            },
            {
                filed: {
                    id: "sex",
                    config: {
                        rules: [
                            {required: true, message: '请输入你的性别!'}],
                    },
                    input: <Select placeholder="请输入你的性别">
                        <Option value="1">男</Option>
                        <Option value="2">女</Option>
                        <Option value="3">未知</Option>
                    </Select>
                }
            },
            {
                filed: {
                    id: "birthday",
                    config: {
                        rules: [{type: 'object', required: true, message: '请输入你的生日!'}],

                    },
                    input: <DatePicker />
                }
            }
            ,
            {
                filed: {
                    id: "description",
                    config: {
                        rules: [
                            {required: true, message: '请输入简介!'}],
                        // initialValue: "1"
                    },
                    input: <TextArea placeholder="请输入简介" autosize={{minRows: 4, maxRows: 8}}/>
                }
            }
            ,
            {
                filed: {
                    id: "status",
                    config: {
                        rules: [
                            {required: true, message: '请输入状态!'}],
                        // initialValue: "1"
                    },
                    input: <Select placeholder="请输入状态">
                        <Option value="1">正常</Option>
                        <Option value="2">冻结</Option>
                    </Select>
                }
            }

        ];
        return <EditDialogTemple
            title="添加用户"
            formItems={formItems}
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
            ref="user_add_dialog"/>;
    }
});

export default withRouter(UserPage);   //将App组件导出