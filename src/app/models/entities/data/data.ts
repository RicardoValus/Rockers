export class data {
    private _name!: string;
    private _email!: string;
    private _downloadMedia!: any;
    private _id!: string;
    private _uid!: any;
    private _services!: string;
    private _calendar!: Date;
    private _time!: string;

    // ------

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    // ------

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    // ------

    public get downloadMedia(): any {
        return this._downloadMedia;
    }
    public set downloadMedia(value: any) {
        this._downloadMedia = value;
    }

    // ------

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    // ------

    public get uid(): any {
        return this._uid;
    }
    public set uid(value: any) {
        this._uid = value;
    }

    // ------

    public get services(): string {
        return this._services;
    }
    public set services(value: string) {
        this._services = value;
    }

    // ------

    public get calendar(): Date {
        return this._calendar;
    }
    public set calendar(value: Date) {
        this._calendar = value;
    }

    // ------

    public get time(): string {
        return this._time;
    }
    public set time(value: string) {
        this._time = value;
    }
}

