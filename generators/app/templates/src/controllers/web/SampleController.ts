import {Inject, Service} from "typedi";
import {Controller, Get, Post, Redirect, Render, QueryParam, HttpCode, Req, Res} from "routing-controllers";
import {UserService} from "../../services/UserService";
import {User} from "../../model/User";
import {ApiSampleController} from "../api/ApiSampleController";
import {Request, Response} from "express";
import * as crypto from "crypto";

@Service()
@Controller()
export class SampleController {

    @Inject()
    private users: UserService;

    @Inject()
    private api: ApiSampleController;

    /**
     * Generate sample content if nothing provided.
     * @returns {Promise<void>}
     */
    private async checkUsers() {
        const users: User[] = await this.users.getAll();
        if (!users.length) {
            const sample = [
                'A Simple user',
                'Another kind of user',
                'Mah user',
                'm8s',
                'Hello World'
            ];
            for (const name of sample) {
                const user = new User();
                user.name = name;
                user.token = crypto.createHash('sha512').update(name).digest('hex');
                await this.users.persist(user);
            }
        }
    }

    constructor (@Inject('config') private config: any) {}

    /**
     * Sample index action.
     * @returns {any}
     */
    @Render('index')
    @Get('/')
    @HttpCode(200)
    async indexAction(): Promise<any> {
        await this.checkUsers();
        const users: User[] = await this.users.getAll();
        return {
            port: this.config.host.port,
            title: this.config.sample.title,
            users: users
        };
    }

}