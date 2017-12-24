import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Sample ORM entity
 */
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    private _id: number;

    @Column()
    private _name: string;

    @Column({length: 128})
    private _token: string;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get token(): string {
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }
}