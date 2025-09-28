import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { NotificationType, NotificationTemplate } from '../dto/notification.dto';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  recipient: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({ type: 'enum', enum: NotificationTemplate, nullable: true })
  template?: NotificationTemplate;

  @Column('json', { nullable: true })
  templateData?: Record<string, any>;

  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'failed' | 'delivered';

  @Column({ nullable: true })
  messageId?: string;

  @Column('text', { nullable: true })
  error?: string;

  @Column({ nullable: true })
  deliveredAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}