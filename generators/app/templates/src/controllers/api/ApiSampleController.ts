import {JsonController, Get, Param} from "routing-controllers";
import {Inject, Service} from "typedi";
import {UserService} from "../../services/UserService";
import {User} from "../../model/User";
import * as crypto from 'crypto';

@Service()
@JsonController('/api')
export class ApiSampleController {

    @Inject()
    private users: UserService;

    /**
     * Sample API type insert
     * @param {string} name
     * @returns {Promise<any>}
     */
    @Get('/insert/:name')
    async insertAction(@Param('name') name: string): Promise<any> {
        const user = new User();
        user.name = name;
        user.token = crypto.createHash('sha1').update(name).digest('hex');
        this.users.persist(user);
        return 'ok';
    }

    /**
     * Simple Hello World from the API
     * @returns {Promise<any>}
     */
    @Get('/test')
    async testAction(): Promise<any> {
        return this.users.getAll();
    }

}