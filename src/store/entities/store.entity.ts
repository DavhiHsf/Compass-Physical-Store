import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('increment')
  storeID: number;

  @Column()
  storeName: string;

  @Column()
  street: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  type: string;

  @Column()
  emailAddress: string;

  @Column()
  phoneNumber: string;

  @Column()
  takeOutInStore: boolean;

  @Column()
  shippingTimeInDays: number;
}