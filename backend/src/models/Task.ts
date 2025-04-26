import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

class Task extends Model {
  public id!: number;
  public title!: string;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 1000],
      },
    }
  },
  {
    sequelize,
    modelName: 'Task',
    timestamps: true,
  }
);

export default Task; 