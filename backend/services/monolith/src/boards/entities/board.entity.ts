import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Board {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "varchar", length: 255 })
    title: string;
}
