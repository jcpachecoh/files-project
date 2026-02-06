import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('files')
export class FileTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  folderId: string | null;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ length: 500 })
  path: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
