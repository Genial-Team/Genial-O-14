module.exports = {
    fr:{
        permissions: {
          dontHaveAdminPermission : "Vous devez être administrateur pour exécuter cette commande"
        },
        configError: {
            serverMustBeConfigured : "Votre serveur doit être configuré pour avoir accès à cette fonctionnalité (faites /setup pour le configuré)"
        },
        commandError:{
            commonError : "une erreur est survenue, merci de re-essayez plus tard",
            ProcessError : "Une erreur interne s'est produite, merci de re-essayez plus tard ou de contacté l'équipe de développement",
            noArgumentFound: "une erreur est survenue, merci de vérifié les argument de votre commande"
        },
        checkingValidity:{
            canNotBeUsedOnDM : "cette commande doit être utilisé que dans un server"
        }
    },
    en:{
        permissions: {
            dontHaveAdminPermission : "You must be an administrator to run this command"
        },
        configError: {
            serverMustBeConfigured : "Your server must be configured to have access to this feature (do /setup to configure it)"
        },
        commandError:{
            commonError : "an error occurred, please try again later",
        },
        checkingValidity:{
            canNotBeUsedOnDM : "this command must be used only on a server"
        }
    }
}