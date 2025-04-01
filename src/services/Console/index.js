export default class Console {
    constructor(){

    }

    consoleLog = async ({ 
        startClear = false, 
        endClear = false, 
        /*  */
        message = null, 
        clear = false, 
        awaitClear = null 
    } = {}) => {
        try {
            return new Promise(resolve => {
                if(startClear){ console.clear(); }
                if(endClear){ console.clear(); }
                /*  */
                if (awaitClear != null) {
                    console.log(message);
                    setTimeout(() => {
                        if (clear) { console.clear(); }
                        resolve(); // Resolve a promessa após o timeout
                    }, awaitClear);
                } else {
                    console.log(message);
                    if (clear) { console.clear(); }
                    resolve(); // Resolve a promessa imediatamente
                }
            });
        } catch (error) {
            return error;
        }
    };
}