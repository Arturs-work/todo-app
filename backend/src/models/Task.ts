import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

class Task extends Model {
  public id!: string;
  public title!: string;
  public type!: 'text' | 'checklist';
  public content!: string | string[];
  public createdAt!: Date;
  public completedItems?: boolean[];
  public order!: number;
  public pinned!: boolean;
}

Task.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 1000],
      },
    },
    type: {
      type: DataTypes.ENUM('text', 'checklist'),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue('content');
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      },
      set(value: string | string[]) {
        this.setDataValue('content', JSON.stringify(value));
      },
    },
    completedItems: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('completedItems');
        if (!value) return undefined;
        try {
          return JSON.parse(value);
        } catch (e) {
          return undefined;
        }
      },
      set(value: boolean[] | undefined) {
        this.setDataValue('completedItems', value ? JSON.stringify(value) : null);
      },
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Task',
    timestamps: true,
  }
);

export default Task; 