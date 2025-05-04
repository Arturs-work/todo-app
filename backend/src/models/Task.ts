import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

export type TaskType = 'text' | 'checklist';

class Task extends Model {
  public id!: number;
  public type!: TaskType;
  public title!: string;
  public content!: string | string[];
  public completedItems?: boolean[];
  public order!: number;
  public boardId!: string;
  public pinned!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('text', 'checklist'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 1000],
      },
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
    pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    boardId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Task'
  }
);

export default Task; 