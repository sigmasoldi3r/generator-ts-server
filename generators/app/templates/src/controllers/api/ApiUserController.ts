import {JsonController, Get, Post, Param, BodyParam, Body, Put} from "routing-controllers";
import {Inject} from "typedi";
import {UserService} from "../../services/UserService";
import {User} from "../../model/User";
import {EntityFromParam} from "typeorm-routing-controllers-extensions";

/**
 * RESTy API controller
 * Resource: User
 */
@JsonController('/api/users')
export class ApiUserController {

    @Inject()
    private users: UserService;

    /**
     * Get resource: One User
     * @param {User} user
     * @returns {Promise<any>}
     */
    @Get('/:id')
    async getOneUserAction(@EntityFromParam('id') user: User): Promise<any> {
        return user;
    }

    /**
     * Get resource: User
     * @returns {Promise<any>}
     */
    @Get('/')
    async getUsersAction(): Promise<any> {
        return this.users.getAll();
    }

  /**
   * Modify resource: User
   * @param {User} user
   * @param body
   * @returns {Promise<any>}
   */
    @Put('/:id')
    async updateUserAction(@EntityFromParam('id') user: User, @Body() body: any): Promise<any> {
      if (body.name) {
        user.name = body.name;
      }
      if (body.token) {
        user.token = body.token;
      }
      await this.users.persist(user);
      return user;
    }

  /**
   * Insert resource: One User
   * @param {string} name
   * @param {string} token
   * @returns {Promise<any>}
   */
    @Post('/')
    async creteUserAction(@BodyParam('name') name: string, @BodyParam('token') token: string): Promise<any> {
      const user = new User();
      user.token = token;
      user.name = name;
      await this.users.persist(user);
      return user;
    }
}
