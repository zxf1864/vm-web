import React from "react";
import {Button, DatePicker, Icon, Input, Layout, Menu, message, Select, Table, Upload} from "antd";
import moment from 'moment';
import {withRouter} from "react-router-dom";
import "antd/dist/antd.css";
import "../../scss/movie/movie_page.scss";
import "../base/events_dispatcher";
import {ajax, commons} from "../base/vm_util";
import EditDialogTemple from "../base/edit_dialog_temple";
const Option = Select.Option;
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const Search = Input.Search;
const TextArea = Input.TextArea;


var MovieEditDialog = React.createClass({
    getInitialState(){
        return {
            title: "修改电影信息",
            editMovieUrl: "/movie/info",
            getFilmmakersUrl: "/filmmaker/info/list",
            getActorIdsUrl: "/filmmaker/id/list/",//   ---/filmmaker/id/{movieId}
            tipOfEditing: '正在保存电影修改',
            filmmakers: [],
            actorIds: []
        };
    },
    updateFilmmakers(filmmakers){
        this.setState({filmmakers: filmmakers});
    },
    updateActorIds(actorIds){
        this.setState({actorIds: actorIds});
    },
    loadFilmmakerData () {
        const {getFilmmakersUrl} = this.state;
        ajax.get({
            url: getFilmmakersUrl,
            success: function (result) {

                this.updateFilmmakers(result.data.list)

            }.bind(this),
            failure: function (result) {
                message.error(result.msg);

            }.bind(this),
            complete: function () {

            }.bind(this)
        });
    },
    loadActorIdsData (movieId) {
        const {getActorIdsUrl} = this.state;
        ajax.get({
            url: getActorIdsUrl + movieId,
            success: function (result) {

                this.updateActorIds(result.data.list)

            }.bind(this),
            failure: function (result) {
                message.error(result.msg);

            }.bind(this),
            complete: function () {

            }.bind(this)
        });
    },
    showDialog(record){

        this.getMovieEditDialog().showDialog();

        this.loadFilmmakerData();

        this.loadActorIdsData(record.id);
    },
    getMovieEditDialog(){
        return this.refs.movie_edit_dialog;
    },
    handleSubmit(values){
        const {editMovieUrl, tipOfEditing} = this.state;
        const hideMessage = message.loading(tipOfEditing, 0);
        var filterValues = function (values) {
            values.releaseTime = timeFormatter.long2Int(new Date(values.releaseTime._d).getTime());
            values.actorIds = values.actorIds.join(",");
            return values;
        }
        values = filterValues(values);
        // c(values);
        ajax.put({
            url: editMovieUrl,
            data: values,
            success: function (result) {
                const {onEditSuccess} = this.props;


                message.success(result.msg);
                this.getMovieEditDialog().closeDialog();
                //callback
                !isUndefined(onEditSuccess) ? onEditSuccess(result.data.movie) : undefined;


                //clear form
                // this.getMovieEditDialog().clearForm();
            }.bind(this),
            failure: function (result) {
                message.error(result.msg);

            },
            complete: function () {
                hideMessage();
                this.getMovieEditDialog().formLeaveLoading();
            }.bind(this)
        });

    },
    handleCancel(){

        c("handleCancel");
    },
    componentDidMount(){

    },
    handleFilmmakerSelectChange(value){
        console.log(`Selected: ${value}`);

    },
    render(){

        var {echoData} = this.props;
        echoData = commons.clone(echoData);//!!!!!!!!!!!!!important
        // filterEchoData
        var filterEchoData = function (echoData) {
            if (isUndefined(echoData)) {
                return {};
            }
            if (!isUndefined(echoData.createTime)) {
                echoData.createTime = timeFormatter.formatDate(echoData.createTime * 1000);
            }
            if (!isUndefined(echoData.updateTime)) {
                echoData.updateTime = timeFormatter.formatDate(echoData.updateTime * 1000);

            }
            if (!isUndefined(echoData.releaseTime)) {
                echoData.releaseTime = moment(echoData.releaseTime * 1000);

            }
            return echoData;
        }
        echoData = filterEchoData(echoData);


        const {filmmakers, actorIds} = this.state;

        //filmmakerOptions,actorOptions
        var filmmakerOptions = [];

        if (!isUndefined(filmmakers)) {
            filmmakerOptions = filmmakers.map(function (item, i) {
                const val = item.id + '';
                const title = "姓名：" + item.name + "\r\n别名：" + item.alias + "\r\n简介:" + item.description;
                return <Option title={title} key={item.name} value={val}>{item.name}</Option>;
            }.bind(this));
        }


        var formLayout = "horizontal";

        var formRows = [
                {
                    cols: [
                        {
                            col: {span: 11},
                            label: "id",
                            id: "id",
                            config: {
                                initialValue: echoData.id,
                            },
                            input: <Input name="id"
                                          autoComplete="off"
                                          disabled={true}/>
                        },
                        {
                            col: {span: 2},
                            input: <div></div>
                        },
                        {
                            col: {span: 11},
                            label: "名称",
                            id: "name",
                            config: {
                                initialValue: echoData.name,
                                rules: [{required: true, message: '请输入电影名称!'}],

                            }
                            ,
                            input: <Input placeholder="请输入电影名称" name="name"/>
                        }
                    ]

                },
                {
                    cols: [
                        {
                            col: {span: 11},
                            label: "状态",
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
                        ,
                        {
                            col: {span: 2},
                            input: <div></div>
                        },
                        {
                            col: {span: 11},
                            label: "别名",
                            id: "alias",
                            config: {
                                initialValue: echoData.alias,
                                rules: [{required: true, whitespace: true, message: '请输入别名!'}],
                            },
                            input: <Input name="alias"
                                          prefix={<Icon type="movie"
                                                        style={{color: 'rgba(0,0,0,.25)'}}/>}
                                          autoComplete="off"
                                          placeholder="别名"/>
                        }
                    ]


                },
                {
                    cols: [
                        {
                            col: {span: 11},
                            label: "发布时间",
                            id: "releaseTime",
                            config: {
                                initialValue: echoData.releaseTime,
                                rules: [{type: 'object', required: true, whitespace: true, message: '请输入发布时间!'}],
                            }
                            ,
                            input: <DatePicker name="releaseTime"
                                               autoComplete="off"
                                               placeholder="请输入发布时间"/>
                        },

                        {
                            col: {span: 2},
                            input: <div></div>
                        },
                        {
                            col: {span: 11},
                            label: "评分",
                            id: "ignore_score",
                            config: {
                                initialValue: echoData.score,
                            }
                            ,
                            input: <Input name="ignore_score"
                                          autoComplete="off"
                                          disabled={true}/>
                        }
                    ]


                },
                {
                    cols: [
                        {
                            col: {span: 11},
                            label: "观看数",
                            id: "ignore_watchNum",
                            config: {
                                initialValue: echoData.watchNum,
                            }
                            ,
                            input: <Input disabled={true}/>
                        }
                        ,
                        {
                            col: {span: 2},
                            input: <div></div>
                        },
                        {
                            col: {span: 11},
                            label: "电影时长(分钟)",
                            id: "movieTime",
                            config: {
                                initialValue: echoData.movieTime,
                                rules: [{required: true, message: '请输入电影时长!'}],
                            }
                            ,
                            input: <Input name="movieTime"
                                          autoComplete="off"
                                          placeholder="请输入电影时长"/>
                        }
                    ]


                },
                {
                    cols: [
                        {
                            col: {span: 11},
                            label: "创建时间",
                            id: "ignore_createTime",
                            config: {
                                initialValue: echoData.createTime,
                            }
                            ,
                            input: <Input disabled={true}/>
                        }
                        ,
                        {
                            col: {span: 2},
                            input: <div></div>
                        },
                        {
                            col: {span: 11},
                            label: "最后更新时间",
                            id: "ignore_updateTime",
                            config: {
                                initialValue: echoData.updateTime,
                            }
                            ,
                            input: <Input disabled={true}/>
                        }
                    ]


                },

                {
                    cols: [
                        {
                            col: {span: 24},
                            label: "演员",
                            id: "actorIds",
                            config: {
                                initialValue: commons.toStrArr(actorIds),
                                rules: [{required: true, message: '请选择演员!'}],
                            }
                            ,
                            input: <Select
                                mode="multiple"
                                optionFilterProp="children"
                                notFoundContent="无相关电影人"
                                placeholder="请选择演员"
                                onChange={this.handleFilmmakerSelectChange}
                                style={{width: '100%'}}
                            >
                                {filmmakerOptions}
                            </Select>
                        }


                    ]


                },
                {
                    cols: [
                        {
                            col: {span: 24},
                            label: "简介",
                            id: "description",
                            config: {
                                initialValue: echoData.description,
                                rules: [{required: true, message: '请输入简介!'}],
                            }
                            ,
                            input: <TextArea placeholder="请输入简介" autosize={{minRows: 4, maxRows: 8}}/>
                        }


                    ]


                },


            ]
        ;
        const {title} = this.state;
        return <EditDialogTemple
            title={title}
            formRows={formRows}
            formLayout={formLayout}
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
            ref="movie_edit_dialog"/>;
    }
});

export default MovieEditDialog;   //将App组件导出
