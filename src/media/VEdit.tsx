import * as React from "react";
import _ from 'lodash';
import { consts } from "consts";
import { CMedia } from "./CMedia";
import { observer } from "mobx-react";
import { VPage, UiSchema, Schema, UiInputItem, Page, Form, Context, ImageUploader, nav } from "tonva";
import { observable } from "mobx";

export class VEdit extends VPage<CMedia> {
    @observable private media: any;
    @observable private mediaPath: string;
    private form: Form;
    async open(media: any) {
        this.media = media;
        this.openPage(this.page);
    }

    private onAddSalesTask = async (model: any) => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private get mediaId() { return this.media && this.media.id; }
    private getMediaPath(resId:string):string { return nav.resUrl + (resId.substr(1)) }

    private onFormButtonClick = async (name: string, context: Context) => {
        let param = _.clone(context.form.data);
        param.path = this.mediaPath;
        await this.controller.saveItem(this.mediaId, param);
        this.closePage();
    }

    private uiSchema: UiSchema = {
        items: {
            caption: { widget: 'text', label: '标题', placeholder: '图片标题' } as UiInputItem,
            submit: { widget: 'button', label: '提交' }
        }
    };

    private schema: Schema = [
        { name: 'caption', type: 'string', required: true },
    ];

    private onSaved = (resId:string):Promise<void> => {
        this.mediaPath= this.getMediaPath(resId);
        this.closePage();
        return;
    }

    private onUpload = () => {
        this.media = this.form.data;
        this.openPageElement(<ImageUploader onSaved={this.onSaved} />);
    }

    private page = observer(() => {
        let image:any;
        let saveButton:any;
         if (this.mediaPath) {
            image = <div className="m-3 text-center w-max-30c"><img src={this.mediaPath} /></div>;
            saveButton = <div className="px-1 ">
                <div className="text-content text-center">
                    <button type="button" className="btn btn-primary mx-2" onClick={this.onAddSalesTask} >保存</button>
                </div>
            </div>;
         }
         else {
            image = <div className="text-content text-center">
                <button className="btn btn-primary" onClick={this.onUpload}>上传图片</button>
            </div>;
         }

        return <Page header="编辑图片" headerClassName={consts.headerClass}>
            <div className="mx-3">
                <Form ref={v => this.form = v} className="my-3"
                    formData={this.media}
                    schema={this.schema}
                    uiSchema={this.uiSchema}
                    onButtonClick={this.onFormButtonClick}
                    requiredFlag={true}
                />
            </div>
            {image}
            {saveButton}
        </Page>
    })
}