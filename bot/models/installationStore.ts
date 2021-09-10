import newRelic from "newrelic";
import { InstallationFactory } from "./installation";
import { Installation as InstallationType } from "@slack/bolt";
import { Sequelize } from "sequelize/types";

export function createInstallationStore(sequelize: Sequelize) {
  const Installation = InstallationFactory(sequelize);

  return {
    storeInstallation: async (installation) => {
      newRelic.incrementMetric("InstallationStore/storeInstallation");

      await Installation.create({
        id: installation.isEnterpriseInstall
          ? installation.enterprise.id
          : installation.team.id,
        isEnterpriseInstallation: installation.isEnterpriseInstall,
        installationObject: installation
      });
    },
    fetchInstallation: async (query) => {
      newRelic.incrementMetric("InstallationStore/fetchInstallation");

      const installation = await Installation.findByPk(
        query.isEnterpriseInstall ? query.enterpriseId : query.teamId
      );

      return installation.installationObject as InstallationType;
    },
    deleteInstallation: async (query) => {
      newRelic.incrementMetric("InstallationStore/deleteInstallation");

      const installation = await Installation.findByPk(
        query.isEnterpriseInstall ? query.enterpriseId : query.teamId
      );

      await installation.destroy();
    }
  };
}
