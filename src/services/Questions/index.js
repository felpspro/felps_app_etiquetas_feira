import inquirer from "inquirer";

export default class Questions {
    constructor(){

    }

    questionSimple = async({ message = 'Mensagem', name = 'value' }={}) => {
        try {
            return await inquirer
            .prompt({ type:'input', message: `${message}: `, name })
            .then(respostas => respostas)
            .catch(err => err)
        } catch (error) {
            return error;
        }
    }

    questionList = async({ message = '', listOptions = [] }={}) => {
        try {
            return await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'value',
                    message: message,
                    choices: listOptions
                }
            ])
            .then(respostas => respostas)
            .catch(err => err)
        } catch (error) {
            return error;
        }
    }
}