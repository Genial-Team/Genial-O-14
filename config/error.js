module.exports = {
    fr:{
        permissions: {
            dontHaveAdminPermission : "Vous devez être administrateur pour exécuter cette commande",
            dontHaveManageMessagePermission: "Vous devez avoir la permission de supprimer les messages pour exécuter cette commande",
            dontHaveManageNicknamePermission: "Vous devez avoir la permission d'éditer les surnoms pour exécuter cette commande",
        },
        configError: {
            serverMustBeConfigured : "Votre serveur doit être configuré pour avoir accès à cette fonctionnalité (faites /setup pour le configuré)"
        },
        commandError:{
            commonError : "une erreur est survenue, merci de re-essayez plus tard",
            bulkDelete: "Vous ne pouvez supprimer que les messages datant de moins de 14 jours.",
            processError : "Une erreur interne s'est produite, merci de re-essayez plus tard ou de contacté l'équipe de développement",
            noArgumentFound: "une erreur est survenue, merci de vérifié les arguments de votre commande"
        },
        checkingValidity:{
            canNotBeUsedOnDM : "cette commande doit être utilisé que dans un server"
        }
    },
    en:{
        permissions: {
            dontHaveAdminPermission : "You must be an administrator to run this command",
            dontHaveManageMessagePermission: "You must have a manage message to run this command",
            dontHaveManageNicknamePermission:  "You must have a manage nickname to run this command"

        },
        configError: {
            serverMustBeConfigured : "Your server must be configured to have access to this feature (do /setup to configure it)"
        },
        commandError:{
            commonError : "an error occurred, please try again later",
            bulkDelete: "You can only bulk delete messages that are under 14 days old.",
            processError: "An internal error has occurred, please try again later or contact the development team.",
            noArgumentFound: "an error has occurred, please check the arguments of your command"
        },
        checkingValidity:{
            canNotBeUsedOnDM : "this command must be used only on a server"
        }
    }
}