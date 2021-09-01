import { DataTypes, Model, Sequelize } from "sequelize";

export interface InstallationCreationAttributes {
  id: string;
  isEnterpriseInstallation: boolean;
  installationObject: object;
}

export interface InstallationAttributes {
  id: string;
  isEnterpriseInstallation: boolean;
  installationObject: object;
  createdAt: Date;
  updatedAt: Date;
}

export class Installation extends Model<InstallationAttributes, InstallationCreationAttributes> implements InstallationAttributes {
  id: string;
  isEnterpriseInstallation: boolean;
  installationObject: object;
  createdAt: Date;
  updatedAt: Date;
}

export function InstallationFactory(sequelize: Sequelize) {
  Installation.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    isEnterpriseInstallation: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    installationObject: {
      allowNull: false,
      type: DataTypes.JSON,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
  });

  return Installation;
};
