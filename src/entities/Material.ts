import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {t} from 'elysia'

@Entity()
class Material {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  stampCode!: string

  @Column()
  code!: string

  @Column({
    nullable: true
  })
  name!: string
  @Column({
    nullable: true
  })
  entryDate!: Date

  @Column({
    nullable: true
  })
  status!: string

  @Column({
    nullable: true
  })
  creatorCode!: string //danh điểm (số chế tạo)

  @Column({
    nullable: true
  })
  device!: string  //thiết bị

  @Column({
    nullable: true
  })
  unit!: string //đơn vị tính

  @Column({
    type: 'text',
    nullable: true
  })
  images!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date

  static toDTO(isCreate = true) {
    return isCreate ? t.Object({
      stampCode: t.String(),
      code: t.String(),
      name: t.String(),
      entryDate: t.String(),
      status: t.String(),
      creatorCode: t.String(),
      device: t.String(),
      unit: t.String(),
      images: t.String(),
    }) : t.Object({
      stampCode: t.Optional(t.String()),
      code: t.Optional(t.String()),
      name: t.Optional(t.String()),
      entryDate: t.Optional(t.String()),
      status: t.Optional(t.String()),
      creatorCode: t.Optional(t.String()),
      device: t.Optional(t.String()),
      unit: t.Optional(t.String()),
      images: t.Optional(t.String()),
    })
  }


}

export default Material
